<?php

$app->post('/post/register', function() use ($app){
	/* Methods */
	
	/* Construction */
	if($_POST['first'] &&  $_POST['last'] &&  $_POST['username'] &&  $_POST['company'] &&  $_POST['email'] &&  $_POST['password']){
		
		$first = filter_var($_POST['first'], FILTER_SANITIZE_STRING);
		$last = filter_var($_POST['last'], FILTER_SANITIZE_STRING);
		$company = filter_var($_POST['company'], FILTER_SANITIZE_STRING);
		$email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
		$username = filter_var($_POST['username'], FILTER_SANITIZE_STRING);
		$easy = str_replace(' ', '', $company);
		$easy = substr($easy, 0, 16); // Return first 16 chars
		
		if($app->sql->get('master.uac')->where('company', '=', $_POST['company'])->run()){
			$app->flash('error', '<b>'.$company.'</b> is already signed up! Please contact support if you can\'t access your account.');
			$app->redirect($app->root);
		}else if($app->sql->get('master.uac')->where('email', '=', $_POST['email'])->run()){
			$app->flash('error', '<b>'.$_POST['email'].'</b> is already registered. Please contact support if you can\'t access your account.');
			$app->redirect($app->root);
		}else if($app->sql->get('master.uac')->where('username', '=', $_POST['username'])->run()){
			$app->flash('error', 'Sorry, the username <b>'.$_POST['username'].'</b> is taken. Please try something else.');
			$app->redirect($app->root);
		}else{
			
			// Password hashing
			$password = password_hash($_POST['password'], PASSWORD_DEFAULT);
			
			// Add user to uac
			$uacID = $app->sql->post('master.uac')->with([
				'email'		=> $email,
				'username'	=> $username,
				'password'	=> $password,
				'company'	=> $company,
				'easy'		=> $easy,
				'first'		=> $first,
				'last'		=> $last,
			])->run();
			
			$app->event->log([
				'number' => 901,
				'title' => $username.' added to UAC.',
			]);
			
			// Create storage directories
			mkdir('../app/app/storage/clients/'.$easy, 0777);
			mkdir('../app/app/storage/clients/'.$easy.'/pdf', 0777);
			
			$app->event->log([
				'number' => 900,
				'title' => 'Database and storage directories made for '.$username,
			]);

			// Log the user in
			$user = $app->sql->get('master.uac')->where('uacID', '=', $uacID)->run();
			// Generate new cookie, sign user in, flag as logged_in, redirect to home page
			$cookie = bin2hex(random_bytes(32));
			setcookie('@', $cookie, time() + 31536000, '/');
			$app->sql->put('master.uac')->where('username', '=', $user['username'])->with([
				'cookie'	=> $cookie
			])->run();
			$app->cookie->session($cookie, $user);
			$app->event->log([
				'number' => 903,
				'title' => 'User '.$username.' created successfully.',
			]);
			$app->redirect($app->root.'/jobs');
		}
		
	}else{
		$app->flash('error', 'Please fill out all of the fields!');
		$app->redirect($app->root);
	}
});