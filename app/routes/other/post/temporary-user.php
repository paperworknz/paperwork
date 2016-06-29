<?php

$app->post('/post/temporary-user', 'app', function() use ($app){
	/* Methods */
	
	/* Construction */
	// Check for available users
	$user = $app->sql->get('user')->where('privilege', '=', 'guest')->and('active', '=', '0')->root()->one();
	
	if($user){
		
		$action = $app->auth->login($user['username'], 'password', true); // Third param = force login
		
		if($action == 'Authenticated Successfully'){
			echo $app->build->success([
				'location' => $app->root.'/jobs'
			]);
		}else{
			
			$app->event->log([
				'user_id' => 0,
				'text' => 'Guest user failed to authenticate with username',
				'icon' => 'error.png',
			]);
			
			echo $app->build->error('We\'re so sorry, there was a problem with our Guest login');
		}
	}else{
		
		// No guest users available
		$random = substr(str_shuffle(md5(time())), 0, 6);
		$action = $app->auth->register([
			'first' => 'Friend',
			'last' => 'Last Name',
			'company' => $random,
			'username' => $random,
			'password' => $random,
			'confirm' => $random,
			'email' => $random.'@email.com',
			'privilege' => 'guest',
		], [
			'email' => false,
		]);
		
		switch($action){
			case 'Company Exists':
				echo $app->build->error('Company is already signed up!<br>Please contact support if you can\'t access your account.');
				break;
			case 'Email Exists':
				echo $app->build->error('Email is already registered.<br>Please contact support if you can\'t access your account.');
				break;
			case 'Username Exists':
				echo $app->build->error('Sorry, the username is taken!<br>Please try something else.');
				break;
			case 'Password Mismatch':
				echo $app->build->error('Sorry, the passwords your entered did not match.');
				break;
			case 'Registration Successful':
				
				$action = $app->auth->login($random, $random, true); // Third param = force login
				
				if($action == 'Authenticated Successfully'){
					echo $app->build->success([
						'location' => $app->root.'/jobs'
					]);
				}else{
					
					$app->event->log([
						'user_id' => 0,
						'text' => 'Guest user failed to authenticate with username',
						'icon' => 'error.png',
					]);
					
					echo $app->build->error('We\'re so sorry, there was a problem with our Guest login');
				}
				break;
		}
	}
	
});