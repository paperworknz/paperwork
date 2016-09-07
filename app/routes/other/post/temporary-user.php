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
	
	// Dummy data
	$status_id = $app->sql->get('job_status')->select('id')->one();
	
	$client_id = $app->sql->post('client')->with([
		'client_number' => 1,
		'name' => 'My Favourite Client',
		'address' => '1 Earth, Milky Way',
		'email' => 'spectacular@email.com',
		'phone' => '123 123 1234',
		'notes' => 'This man is my favourite client!',
	])->run();
	
	$job_id = $app->sql->post('job')->with([
		'job_number' => 100,
		'name' => 'Build everything',
		'notes' => "You can start a new Quote or Invoice by pressing the plus tab",
		'client_id' => $client_id,
		'job_status_id' => $status_id,
	])->run();
	
	$user_template_id = $app->sql->get('user_template')->select('id')->one();
	
	$job_id = $app->sql->post('document')->with([
		'name' => 'QUOTE',
		'date' => date("d/m/Y"),
		'reference' => 100,
		'description' => '<div>This is a quote.</div><div>Add some items using the input and hitting enter. Edit the item name, quantity, and price below.</div><div><br></div><div>Generate a PDF with the PDF button, and have a play with the Quote tools!</div>',
		'items' => '[{"name":"Door","quantity":"1","price":"50","margin":"1","total":"50"}]',
		'user_template_id' => $user_template_id,
		'client_id' => $client_id,
		'job_id' => $job_id,
	])->run();
	
	// Return
	$app->redirect($app->root.'/job/100');
});