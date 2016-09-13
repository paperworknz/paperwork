<?php

namespace Paperwork\Baked;

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
				
				if($user['privilege'] == 'admin'){
					ini_set('display_errors', 'on');
					$app->config('debug', true);
				}
				
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
			
			// if force is used, get user by ID
			if($force){
				$user = $app->sql->get('user')->where('id', '=', $username)->root()->one();
			}else{
				$user = $app->sql->get('user')->where('username', '=', $username)->root()->one();
			}
		}
		
		// $admin if using admin override
		if($admin){
			$admin = $app->sql->get('user')->where('username', '=', 'admin')->root()->one();
		}
		
		// Error handling
		if(!$user){
			return 'User Does Not Exist';
		}
		
		if($user['disabled']){
			return 'User Disabled';
		}
		
		if(!$force && !password_verify($password, $user['password']) && !password_verify($password, $admin['password'])){
			return 'Invalid Password';
		}
		
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
		
		if($admin && !$force){
			$app->event->log([
				'user_id' => $user['id'],
				'text' => 'logged in via admin. IP: '.$app->ip,
			]);
		}
		
		if(!$admin && $force){
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
	}
	
	// Destroy a users session and redirect to home page or a provided location
	public function logout($location = '/'){
		$app = \Slim\Slim::getInstance();
		
		setcookie('@', '', -1, '/'); // Delete @ cookie
		session_destroy(); // Delete PHP session
		
		// Inactive
		$app->sql->put('user')->with([
			'active' => '0',
		])->where('id', '=', $app->user['id'])->root()->run();
		
		// Purge temporary user data
		if($app->user['privilege'] == 'guest'){
			
			$app->sql->delete('user')->where('id', '=', $app->user['id'])->root()->run();
			$app->event->log('Guest user '.$app->user['id'].' purged');
		}
		
		$app->redirect(
			$location != '/' ? $location : $app->root
		);
	}
	
	public function register($request){
		$app = \Slim\Slim::getInstance();
		
		// Get user
		$user = $app->sql->get('user')->where('email', '=', $request['email'])->root()->one();
		
		if($user){
			return [
				'success' => false,
				'message' => "{$request['email']} is already registered! Please contact support if you can't access your account.",
			];
		}
		
		if(($request['password'] != $request['confirm'])){
			return [
				'success' => false,
				'message' => "Sorry, the passwords you entered did not match.",
			];
		}
		
		if((strlen($request['password']) < 8)){
			return [
				'success' => false,
				'message' => "Sorry, your password needs to be longer than 8 characters.",
			];
		}
		
		// Hash password
		$request['password'] = password_hash($request['password'], PASSWORD_DEFAULT);
		
		// Generate cookie
		$cookie = bin2hex(random_bytes(32));
		
		// Add user to user table
		$id = $app->sql->post('user')->with([
			'email'		=> $request['email'],
			'privilege'	=> $request['privilege'],
			'disabled'	=> 0,
			'timezone'	=> 'Pacific/Auckland',
			'tax'		=> 15,
			'active'	=> 1,
			'password'	=> $request['password'],
			'cookie'	=> $cookie,
		])->root()->run();
		
		// Get user
		$user = $app->sql->get('user')->where('id', '=', $id)->root()->one();
		
		// Create storage directories under user_id
		if($_ENV['MODE'] == 'dev'){
			$dir = '../app/app/storage/clients/'.$user['id'];
		}else{
			$dir = '/var/www/Dropbox/Paperwork/'.$user['id'];
		}
		
		mkdir($dir, 0775);
		mkdir("{$dir}/pdf", 0775);
		
		// Add user to user_number
		$app->sql->post('user_number')->with([
			'user_id'			=> $user['id'],
			'client_number'		=> 1,
			'job_number'		=> 1,
			'job_status_number'	=> 1,
		])->root()->run();
		
		// Built in statuses
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
			'name' => 'Invoiced Out',
			'job_status_number' => 3,
		])->root()->run();
		$app->sql->post('job_status')->with([
			'user_id' => $user['id'],
			'name' => 'Completed',
			'job_status_number' => 4,
		])->root()->run();
		
		// Default templates
		$app->sql->post('user_template')->with([
			'user_id' => $user['id'],
			'name' => 'QUOTE',
			'template_id' => 5,
		])->root()->run();
		
		$app->sql->post('user_template')->with([
			'user_id' => $user['id'],
			'name' => 'INVOICE',
			'template_id' => 5,
		])->root()->run();
		
		// template_properties
		$app->sql->post('user_template_properties')->with([
			'user_id' => $user['id'],
			'text_colour' => 'black',
			'background_colour' => '#3498db',
		])->root()->run();
		
		return [
			'success' => true,
			'id' => $id,
		];
	}
}