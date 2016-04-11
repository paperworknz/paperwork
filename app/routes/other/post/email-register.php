<?php

$app->post('/post/email-register', function() use ($app){
	/* Methods */
	
	/* Construction */
	$email = filter_var($_POST['email'], FILTER_SANITIZE_STRING);
	$app->event->log([
		'number' => 89,
		'title' => 'Email Registration',
		'text' => 'Email: '.$email
	]);
	$app->sql->post('master.email')->with([
		'email' => $email
	])->run();
	$app->flash('success', 'Thank you for signing up!');
	$app->redirect($app->root);
});