<?php

$app->post('/post/login', 'app', function() use ($app){
	/* Methods */
	
	/* Construction */
	$username = $_POST['username'];
	$password = $_POST['password'];
	
	$action = $app->auth->login($username, $password);
	
	switch($action){
		case 'Invalid Password':
			$app->event->log('entered a wrong password with username: '.$username.'. IP: '.$app->ip);
			echo $app->build->error('Your username or password was incorrect');
			break;
		
		case 'User Disabled':
			$app->event->log('tried to log on to a disabled account, username: '.$username.'. IP: '.$app->ip);
			echo $app->build->error('This account is currently disabled. Please contact us if you think this is in error.');
			break;
		
		case 'User Does Not Exist':
			$app->event->log('tried to log into a non-existant account with username: '.$username.'. IP: '.$app->ip);
			echo $app->build->error('Your username or password was incorrect');
			break;
		
		case 'Authenticated Successfully':
			echo $app->build->success([
				'location' => $app->root.'/jobs'
			]);
			break;
	}
	
});