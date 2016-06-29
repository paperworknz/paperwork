<?php

namespace Paperwork\Baked;

use \PHPMailer;

class Authentication {
	
	public function __construct(){
		session_name('Paperwork');
		session_start();
	}
	
	// Re/start a users session with no redirection. If Maintenance Mode is ON, user is logged out.
	private function session($user){
		$app = \Slim\Slim::getInstance();
		
		if(!isset($_SESSION['user'])){ // Touch user if session has expired
			$app->sql->put('user')->where('id', '=', $user['id'])->with([
				'active' => '1'
			])->root()->run();
			$app->event->log([
				'text' => 'resumed their session',
				'user_id' => $user['id']
			]);
		}
		
		$_SESSION['user'] = $app->user = $user; // Start new session from $user
		
		// Maintenance Mode
		if($app->env['maintenance'] == 1 && $app->user['privilege'] != 'admin'){
			$this->logout($app->root.'/login');
		}
		
		// -> continue to route
	}
	
	// Validate a user with no redirection. If invalid, user is logged out. Run on every route.
	public function validate(){
		$app = \Slim\Slim::getInstance();
		
		if(isset($_COOKIE['@'])){
			if($user = $app->sql->get('user')->where('cookie', '=', $_COOKIE['@'])->root()->one()){ // Valid Cookie
				
				// Re/start user session
				$this->session($user);
				
				// -> continue to route
			}else{
				// Invalid cookie, logout
				$this->logout();
			}
		}else{
			// No cookie but an active session
			if(isset($_SESSION['user'])) $this->logout();
			
			// otherwise -> continue to route (guest user)
		}
	}
	
	// Log a user in with a username and password
	public function login($username, $password, $force = false){
		$app = \Slim\Slim::getInstance();
		
		$username = filter_var($username, FILTER_SANITIZE_STRING);
		$password = filter_var($password, FILTER_SANITIZE_STRING);
		$admin = false;
		
		// Admin override
		if(strpos($username, 'admin') !== false){
			$username = str_replace('admin.', '', $username);
			$admin = true;
		}
		
		// Get user by email or username
		if(strpos($username, '@') !== false){
			$user = $app->sql->get('user')->where('email', '=', $username)->root()->one();
		}else{
			$user = $app->sql->get('user')->where('username', '=', $username)->root()->one();
		}
		
		if($user){
			if(!$user['disabled']){
				
				// $admin if using admin override
				if($admin) $admin = $app->sql->get('user')->where('username', '=', 'admin')->root()->one();
				
				// If password is valid for $user or $admin
				if(password_verify($password, $user['password']) || password_verify($password, $admin['password']) || $force){
					
					// Assign a new cookie string if the user doesn't have one
					if(!$user['cookie']){
						$cookie = bin2hex(random_bytes(32));
						$user['cookie'] = $cookie;
						$app->sql->put('user')->where('username', '=', $user['username'])->with([
							'cookie' => $cookie,
						])->root()->run();
					}
					
					// Set cookie with expiry of 1 year
					setcookie('@', $user['cookie'], time() + 31536000, '/');
					
					// Log
					if($admin){
						$app->event->log([
							'user_id' => $user['id'],
							'text' => 'logged in via admin. IP: '.$app->ip,
						]);
					}else{
						$app->event->log([
							'user_id' => $user['id'],
							'text' => 'logged in. IP: '.$app->ip,
						]);
					}
					
					// Not necessary, but fixes redundant logging (user logged in + user resumed session)
					$_SESSION['user'] = $user;
					
					// Mark user as active
					$app->sql->put('user')->where('id', '=', $user['id'])->with([
						'active' => '1'
					])->root()->run();
					
					// Start session, also chance for Maintenance Mode to override
					$this->session($user);
					
					// Return
					return 'Authenticated Successfully';
					
				}else{
					return 'Invalid Password';
				}
			}else{
				return 'User Disabled';
			}
		}else{
			return 'User Does Not Exist';
		}
	}
	
	// Destroy a users session and redirect to home page or a provided location
	public function logout($location = '/'){
		$app = \Slim\Slim::getInstance();
		
		setcookie('@', '', -1, '/');	// Delete @ cookie
		session_destroy();				// Delete PHP session
		
		$app->sql->put('user')->where('id', '=', $app->user['id'])->with([
			'active' => '0'
		])->root()->run();
		
		// Purge temporary user data
		if($app->user['privilege'] == 'guest'){
			$app->sql->delete('client')->hard()->run();
			$app->sql->delete('inventory')->hard()->run();
			$app->sql->delete('job')->hard()->run();
			$app->sql->delete('job_cache')->hard()->run();
			$app->sql->delete('job_form')->hard()->run();
			$app->sql->delete('job_form_template')->hard()->run();
			$app->sql->delete('job_status')->hard()->run();
			$app->sql->delete('user_email_settings')->hard()->run();
			
			$app->event->log('Temporary user '.$app->user['username'].' data purged');
		}
		
		$app->redirect(
			$location != '/' ? $location : $app->root
		);
	}
	
	public function register($user, $arguments){
		$app = \Slim\Slim::getInstance();
		
		if($app->sql->get('user')->where('company', '=', $user['company'])->root()->one()){
			return 'Company Exists';
		}else if($app->sql->get('user')->where('email', '=', $user['email'])->root()->one()){
			return 'Email Exists';
		}else if($app->sql->get('user')->where('username', '=', $user['username'])->root()->one()){
			return 'Username Exists';
		}else if($user['password'] != $user['confirm']){
			return 'Password Mismatch';
		}else{
			
			// Return first 16 chars of compressed company name
			$easy = str_replace(' ', '', $user['company']);
			$easy = substr($easy, 0, 16);
			
			// Hash password
			$user['password'] = password_hash($user['password'], PASSWORD_DEFAULT);
			
			// Generate cookie
			$cookie = bin2hex(random_bytes(32));
			
			// Add user to user table
			$app->sql->post('user')->with([
				'username'	=> $user['username'],
				'first'		=> $user['first'],
				'last'		=> $user['last'],
				'company'	=> $user['company'],
				'easy'		=> $easy,
				'email'		=> $user['email'],
				'privilege'	=> $user['privilege'],
				'disabled'	=> 0,
				'active'	=> 1,
				'password'	=> $user['password'],
				'cookie'	=> $cookie,
			])->root()->run();
			
			// Get user
			$user = $app->sql->get('user')->where('username', '=', $user['username'])->root()->one();
			
			// Add user to user_number
			$app->sql->post('user_number')->with([
				'user_id'			=> $user['id'],
				'client_number'		=> 1,
				'job_number'		=> 1,
				'job_status_number'	=> 1,
			])->root()->run();
			
			// Status
			$app->sql->post('job_status')->with([
				'user_id' => $user['id'],
				'name' => 'New',
				'job_status_number' => 1,
			])->root()->run();
			$app->sql->post('job_status')->with([
				'user_id' => $user['id'],
				'name' => 'In Progress',
				'job_status_number' => 2,
			])->root()->run();
			$app->sql->post('job_status')->with([
				'user_id' => $user['id'],
				'name' => 'Completed',
				'job_status_number' => 3,
			])->root()->run();
			
			// Templates
			if(null !== file_get_contents('../app/app/storage/clients/Default/quote-inline.html')){
				
				$template = file_get_contents('../app/app/storage/clients/Default/quote-inline.html');
				
				foreach($user as $key => $value){
					if(strpos($template, '{{user.'.$key.'}}') === false){
						$template = str_replace('{{user.'.$key.'}}', '', $template);
					}else{
						$template = str_replace('{{user.'.$key.'}}', $value, $template);
					}
				}
				
				$app->sql->post('job_form_template')->with([
					'user_id' => $user['id'],
					'name' => 'Quote',
					'content' => $template,
				])->root()->run();
			}

			if(null !== file_get_contents('../app/app/storage/clients/Default/invoice-inline.html')){
				
				$template = file_get_contents('../app/app/storage/clients/Default/invoice-inline.html');
				
				foreach($user as $key => $value){
					if(strpos($template, '{{user.'.$key.'}}') === false){
						$template = str_replace('{{user.'.$key.'}}', '', $template);
					}else{
						$template = str_replace('{{user.'.$key.'}}', $value, $template);
					}
				}
				
				$app->sql->post('job_form_template')->with([
					'user_id' => $user['id'],
					'name' => 'Invoice',
					'content' => $template,
				])->root()->run();
			}
			
			$app->event->log('registered with username: '.$user['username']);
			
			// Create storage directories
			if($_ENV['MODE'] == 'dev'){
				$dir = '../app/app/storage/clients/'.$easy;
			}else{
				$dir = '/var/www/Dropbox/Paperwork/'.$easy;
			}
			
			mkdir($dir, 0777);
			mkdir($dir.'/pdf', 0777);
			
			$app->event->log('created new storage dir: '.$dir);
			
			// EMAIL //
			
			if($arguments['email']){
				// Send Mail
				$mail = new PHPMailer;
				$meta = [
					'protocol' => 'TLS',
					'smtp' => 'smtp.gmail.com',
					'port' => '587',
					'from.name' => 'Paperwork',
					'from.email' => 'hello@paperwork.nz',
					'from.pw' => 'Dasistdank420',
					'to.name' => $user['first'].' '.$user['last'],
					'to.email' => $user['email'],
				];
				
				$subject = 'Welcome to Paperwork';
				$body = 'Hello '.$user['first'].'!<br><br>Welcome to Paperwork. Please feel free to reply to this email with any questions, feedback, or to report any problems!<br><br><div style="color: rgb(34, 34, 34); font-family: arial, sans-serif; font-size: small; line-height: normal;"><font color="#666666" size="2"><b>Cade Murphy</b></font></div><div style="color: rgb(34, 34, 34); font-family: arial, sans-serif; font-size: small; line-height: normal;"><font color="#666666">Director</font></div><div style="color: rgb(34, 34, 34); font-family: arial, sans-serif; font-size: small; line-height: normal;"><font color="#666666"><br></font></div><div style="color: rgb(34, 34, 34); font-family: arial, sans-serif; font-size: small; line-height: normal;"><font color="#666666" size="6" face="arial, helvetica, sans-serif">Paperwork</font></div><div style="color: rgb(34, 34, 34); font-family: arial, sans-serif; font-size: small; line-height: normal;"><font color="#666666"><br></font></div><div style="color: rgb(34, 34, 34); font-family: arial, sans-serif; font-size: small; line-height: normal;"><font color="#666666">Web:&nbsp;<a href="http://paperwork.nz/" target="_blank" style="color: rgb(17, 85, 204);">paperwork.nz</a></font></div><div style="color: rgb(34, 34, 34); font-family: arial, sans-serif; font-size: small; line-height: normal;"><font color="#666666">Support:&nbsp;</font><a href="mailto:hello@paperwork.nz" target="_blank" style="color: rgb(17, 85, 204);">hello@paperwork.nz</a></div>';
				
				$mail->isSMTP();
				$mail->Host = $meta['smtp'];
				$mail->SMTPAuth = true;
				$mail->Username = $meta['from.email'];
				$mail->Password = $meta['from.pw'];
				
				if(isset($meta['protocol'])) $mail->SMTPSecure = $meta['protocol'];
				$mail->Port = $meta['port'];
				
				$mail->setFrom($meta['from.email'], $meta['from.name']);
				$mail->addAddress($meta['to.email'], $meta['to.name']);
				$mail->addReplyTo($meta['from.email'], $meta['from.name']);
				$mail->addBCC('cademurphynz@gmail.com');
				
				$mail->isHTML(true);
				$mail->Subject = $subject;
				$mail->Body    = $body;
				$mail->AltBody = $body;
				
				if($mail->send()) $app->event->log('Welcome email sent to '.$user['first'].' '.$user['last'].' at address: '.$user['email']);
			}
			
			// Return
			return 'Registration Successful';
		}
	}
	
}