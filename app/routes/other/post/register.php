<?php

$app->post('/post/register', function() use ($app){
	/* Methods */
	
	/* Construction */
	if($_POST['first'] &&  $_POST['last'] &&  $_POST['username'] &&  $_POST['company'] &&  $_POST['email'] &&  $_POST['password']){
		
		$first = filter_var($_POST['first'], FILTER_SANITIZE_STRING);
		$last = filter_var($_POST['last'], FILTER_SANITIZE_STRING);
		$company = filter_var($_POST['company'], FILTER_SANITIZE_STRING);
		$username = filter_var($_POST['username'], FILTER_SANITIZE_STRING);
		$email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
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
			if($_ENV['MODE'] == 'dev'){
				$dir = '../app/app/storage/clients/'.$easy;
			}else{
				$dir = '/var/www/Dropbox/Paperwork/'.$easy;
			}
			
			mkdir($dir, 0777);
			mkdir($dir.'/pdf', 0777);
			mkdir($dir.'/sql', 0777);
			
			$app->event->log([
				'number' => 900,
				'title' => 'Storage directories created for '.$username,
			]);
			
			// Create user database
			$raw = file_get_contents('../app/app/resources/db_schema/app_default.sql'); // Load SQL structure script
			$raw = str_replace('{{database}}', $_ENV['DB_PREFIX'].$username, $raw); // Replace placeholder with `app_$username`
			
			try{
				$app->pdo->master->exec($raw);
			}catch(PDOException $e){
				echo $e;
			}
			
			$app->event->log([
				'number' => 903,
				'title' => 'Database created: '.$_ENV['DB_PREFIX'].$username,
			]);
			
			// Get user
			$user = $app->sql->get('master.uac')->where('uacID', '=', $uacID)->run();
			
			// Generate new cookie
			$cookie = bin2hex(random_bytes(32));
			setcookie('@', $cookie, time() + 31536000, '/');
			
			// Update cookie
			$app->sql->put('master.uac')->where('uacID', '=', $uacID)->with([
				'cookie' => $cookie
			])->run();
			
			// Log user in
			$app->cookie->session($cookie, $user);
			$app->redirect($app->root.'/jobs');
		}
		
	}else{
		$app->flash('error', 'Please fill out all of the fields!');
		$app->redirect($app->root);
	}
});