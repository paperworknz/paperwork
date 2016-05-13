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
			
			$app->event->log([
				'number' => 901,
				'title' => $username.' added to user table.',
			]);
			
			// Create storage directories
			if($_ENV['MODE'] == 'dev'){
				$dir = '../app/app/storage/clients/'.$easy;
			}else{
				$dir = '/var/www/Dropbox/Paperwork/'.$easy;
			}
			
			mkdir($dir, 0777);
			mkdir($dir.'/pdf', 0777);
			
			$app->event->log([
				'number' => 900,
				'title' => 'Storage directories created for '.$username,
			]);
			
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