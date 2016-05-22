<?php

$app->post('/put/email-settings', 'uac', function() use ($app){
	/* Methods */
	
	/* Construction */
	$address	= filter_var($_POST['address'], FILTER_VALIDATE_EMAIL);
	$password	= filter_var($_POST['password'], FILTER_SANITIZE_STRING);
	$smtp		= filter_var($_POST['smtp'], FILTER_SANITIZE_STRING);
	$protocol	= filter_var($_POST['protocol'], FILTER_SANITIZE_STRING);
	$port		= filter_var($_POST['port'], FILTER_SANITIZE_STRING);
	
	// Hash password
	$password = password_hash($password, PASSWORD_DEFAULT);
	
	if($app->sql->get('user_email_settings')->select('user_id')->run()){
		$app->sql->put('user_email_settings')->with([
			'address'	=> $address,
			'password'	=> $password,
			'smtp'		=> $smtp,
			'protocol'	=> $protocol,
			'port'		=> $port,
		])->where('user_id', '=', $app->user['id'])->run();
	}else{
		$app->sql->post('user_email_settings')->with([
			'address'	=> $address,
			'password'	=> $password,
			'smtp'		=> $smtp,
			'protocol'	=> $protocol,
			'port'		=> $port,
		])->run();
	}
	
	$app->flash('success', 'Updated');
	$app->redirect($app->root.'/settings');
});