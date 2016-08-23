<?php

$app->post('/post/temporary-user', 'app', function() use ($app){
	/* Methods */
	
	/* Construction */
	
	// Register new guest user
	$register = $app->auth->register([
		'first' => 'Guest',
		'last' => 'User',
		'company' => 'Your Company Name',
		'email' => 'your@email.com',
		'privilege' => 'guest',
	]);
	
	// Handle result of registration
	
	if($register['message'] != 'Registered Successfully'){
		$app->event->log([
			'text' => 'Guest user registration failed, reason: '.$register['message'],
			'icon' => 'error.png',
		]);
		
		die($app->build->error('We\'re sorry - this is unavailable right now.'));
	}
	
	$login = $app->auth->login($register['id'], '', true); // Third param = force login, password not used
	
	if($login != 'Authenticated Successfully'){
		$app->event->log([
			'text' => 'Guest user registered but failed login, reason: '.$login,
			'icon' => 'error.png',
		]);
		
		die($app->build->error('We\'re sorry - this is unavailable right now.'));
	}
	
	// Log
	$app->event->log('New Guest user logged in with IP: '.$app->ip);
	
	// Return
	echo $app->build->success([
		'location' => $app->root.'/app',
	]);
});