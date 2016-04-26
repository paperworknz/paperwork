<?php

$app->post('/post/login', function() use ($app){
	/* Methods */
	
	/* Construction */
	$username = $_POST['username'];
	$password = $_POST['password'];
	
	$action = $app->auth->login($username, $password);
	
	switch($action){
		case 'Invalid Password':
			$app->event->log([
				'number' => 1,
				'title' => 'Wrong Password',
				'text' => 'Using username: "'.$username.'"',
			]);
			echo $app->build->error('Your username or password was incorrect.');
			break;
		
		case 'User Disabled':
			$app->event->log([
				'number' => 2,
				'title' => 'Disabled Account Login Attempt',
				'text' => $username.' is disabled and has tried to log in.',
			]);
			echo $app->build->error('This account is currently disabled. Please contact us if you think this is in error.');
			break;
		
		case 'User Does Not Exist':
			$app->event->log([
				'number' => 2,
				'title' => 'Unknown Login Attempt',
				'text' => 'Using username: "'.$username.'"',
			]);
			echo $app->build->error('Your username or password was incorrect.');
			break;
		
		case 'Authenticated Successfully':
			
			echo $app->build->success([
				'location' => $app->root.'/jobs'
			]);
			break;
	}
	
});