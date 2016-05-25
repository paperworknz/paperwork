<?php

$app->post('/post/register', function() use ($app){
	/* Methods */
	
	/* Construction */
	if($_POST['first'] &&  $_POST['last'] &&  $_POST['username'] &&  $_POST['company'] &&  $_POST['email'] &&  $_POST['password']){
		
		$first = filter_var($_POST['first'], FILTER_SANITIZE_STRING);
		$last = filter_var($_POST['last'], FILTER_SANITIZE_STRING);
		$company = filter_var($_POST['company'], FILTER_SANITIZE_STRING);
		$username = filter_var($_POST['username'], FILTER_SANITIZE_STRING);
		$password = filter_var($_POST['password'], FILTER_SANITIZE_STRING);
		$confirm = filter_var($_POST['confirm'], FILTER_SANITIZE_STRING);
		$email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
		$easy = str_replace(' ', '', $company);
		$easy = substr($easy, 0, 16); // Return first 16 chars of compressed company name
		
		if($app->sql->get('user')->where('company', '=', $_POST['company'])->god()->one()){
			echo $app->build->error('<b>'.$company.'</b> is already signed up! Please contact support if you can\'t access your account.');
		}else if($app->sql->get('user')->where('email', '=', $_POST['email'])->god()->one()){
			echo $app->build->error('<b>'.$_POST['email'].'</b> is already registered. Please contact support if you can\'t access your account.');
		}else if($app->sql->get('user')->where('username', '=', $_POST['username'])->god()->one()){
			echo $app->build->error('Sorry, the username <b>'.$_POST['username'].'</b> is taken. Please try something else.');
		}else if($password != $confirm){
			echo $app->build->error('Sorry, the passwords your entered did not match.');
		}else{
			
			// Hash password
			$password = password_hash($password, PASSWORD_DEFAULT);
			
			// Generate cookie
			$cookie = bin2hex(random_bytes(32));
			
			// Add user to user table
			$app->sql->post('user')->with([
				'username'	=> $username,
				'first'		=> $first,
				'last'		=> $last,
				'company'	=> $company,
				'easy'		=> $easy,
				'email'		=> $email,
				'disabled'	=> 0,
				'admin'		=> 0,
				'password'	=> $password,
				'cookie'	=> $cookie,
			])->god()->run();
			
			// Get user
			$user = $app->sql->get('user')->where('username', '=', $username)->god()->one();
			
			// Add user to user_number
			$app->sql->post('user_number')->with([
				'user_id'			=> $user['id'],
				'client_number'		=> 1,
				'job_number'		=> 1,
				'job_status_number'	=> 1,
			])->god()->run();
			
			// Status
			$app->sql->post('job_status')->with([
				'user_id' => $user['id'],
				'name' => 'New',
				'job_status_number' => 1,
			])->god()->run();
			$app->sql->post('job_status')->with([
				'user_id' => $user['id'],
				'name' => 'In Progress',
				'job_status_number' => 2,
			])->god()->run();
			$app->sql->post('job_status')->with([
				'user_id' => $user['id'],
				'name' => 'Completed',
				'job_status_number' => 3,
			])->god()->run();
			
			// Templates
			if(null !== file_get_contents('../app/app/storage/clients/Default/quote-inline.html')){
				$quote = file_get_contents('../app/app/storage/clients/Default/quote-inline.html');
				$app->sql->post('job_form_template')->with([
					'user_id' => $user['id'],
					'name' => 'Quote',
					'content' => $quote,
				])->god()->run();
			}

			if(null !== file_get_contents('../app/app/storage/clients/Default/invoice-inline.html')){
				$invoice = file_get_contents('../app/app/storage/clients/Default/invoice-inline.html');
				$app->sql->post('job_form_template')->with([
					'user_id' => $user['id'],
					'name' => 'Invoice',
					'content' => $invoice,
				])->god()->run();
			}
			
			$app->event->log('registered with username: '.$username);
			
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
			// Send Mail
			$mail = new PHPMailer;
			$meta = [
				'protocol' => 'TLS',
				'smtp' => 'smtp.gmail.com',
				'port' => '587',
				'from.name' => 'Paperwork',
				'from.email' => 'hello@paperwork.nz',
				'from.pw' => 'Dasistdank420',
				'to.name' => $first.' '.$last,
				'to.email' => $email,
			];
			
			$subject = 'Welcome to Paperwork';
			$body = 'Hello '.$first.'!<br><br>Welcome to Paperwork. Please feel free to reply to this email with any questions, feedback, or to report any problems!<br><br><div style="color: rgb(34, 34, 34); font-family: arial, sans-serif; font-size: small; line-height: normal;"><font color="#666666" size="2"><b>Cade Murphy</b></font></div><div style="color: rgb(34, 34, 34); font-family: arial, sans-serif; font-size: small; line-height: normal;"><font color="#666666">Director</font></div><div style="color: rgb(34, 34, 34); font-family: arial, sans-serif; font-size: small; line-height: normal;"><font color="#666666"><br></font></div><div style="color: rgb(34, 34, 34); font-family: arial, sans-serif; font-size: small; line-height: normal;"><font color="#666666" size="6" face="arial, helvetica, sans-serif">Paperwork</font></div><div style="color: rgb(34, 34, 34); font-family: arial, sans-serif; font-size: small; line-height: normal;"><font color="#666666"><br></font></div><div style="color: rgb(34, 34, 34); font-family: arial, sans-serif; font-size: small; line-height: normal;"><font color="#666666">Web:&nbsp;<a href="http://paperwork.nz/" target="_blank" style="color: rgb(17, 85, 204);">paperwork.nz</a></font></div><div style="color: rgb(34, 34, 34); font-family: arial, sans-serif; font-size: small; line-height: normal;"><font color="#666666">Support:&nbsp;</font><a href="mailto:hello@paperwork.nz" target="_blank" style="color: rgb(17, 85, 204);">hello@paperwork.nz</a></div>';
			
			$mail->isSMTP();
			$mail->Host = $meta['smtp'];
			$mail->SMTPAuth = true;
			$mail->Username = $meta['from.email'];
			$mail->Password = $meta['from.pw'];
			
			if(isset($meta['protocol'])){
				$mail->SMTPSecure = $meta['protocol'];
			}
			$mail->Port = $meta['port'];
			
			$mail->setFrom($meta['from.email'], $meta['from.name']);
			$mail->addAddress($meta['to.email'], $meta['to.name']);
			$mail->addReplyTo($meta['from.email'], $meta['from.name']);
			
			$mail->isHTML(true);
			$mail->Subject = $subject;
			$mail->Body    = $body;
			$mail->AltBody = $body;
			
			if($mail->send()) $app->event->log('Welcome email sent to '.$first.' '.$last.' at address: '.$email);
			
			// Return
			echo $app->build->success([
				'message' => 'Registration Successful'
			]);
		}
		
	}else{
		$app->flash('error', 'Please fill out all of the fields!');
		$app->redirect($app->root);
	}
});