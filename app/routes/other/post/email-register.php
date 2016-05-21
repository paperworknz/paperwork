<?php

$app->post('/post/email-register', function() use ($app){
	/* Methods */
	
	/* Construction */
	$email = filter_var($_POST['email'], FILTER_SANITIZE_STRING);
	
	$app->event->log('registered their email: '.$email);
	
	$app->sql->post('email')->with([
		'email' => $email
	])->god()->run();
	$app->flash('success', 'Thank you for signing up!');
	$app->redirect($app->root);
});