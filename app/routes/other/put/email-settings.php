<?php

$app->post('/put/email-settings', 'uac', function() use ($app){
	/* Methods */
	
	/* Construction */
	$address	= filter_var($_POST['address'], FILTER_VALIDATE_EMAIL);
	$smtp		= filter_var($_POST['smtp'], FILTER_SANITIZE_STRING);
	$protocol	= filter_var($_POST['protocol'], FILTER_SANITIZE_STRING);
	$port		= filter_var($_POST['port'], FILTER_SANITIZE_STRING);
	
	// Hash password
	$user_email = $app->sql->get('user_email')->select('user_id')->one();
	
	if(!$user_email){
		$app->sql->post('user_email')->with([
			'address'	=> $address,
			'smtp'		=> $smtp,
			'protocol'	=> $protocol,
			'port'		=> $port,
		])->run();
		
		$app->event->log('updated their email settings');
		$app->flash('success', 'Updated');
		return $app->redirect($app->root.'/settings');
	}
	
	$app->sql->put('user_email')->with([
		'address'	=> $address,
		'smtp'		=> $smtp,
		'protocol'	=> $protocol,
		'port'		=> $port,
	])->where('user_id', '=', $app->user['id'])->run();
	
	$app->event->log('updated their email settings');
	$app->flash('success', 'Updated');
	return $app->redirect($app->root.'/settings');
});