<?php

$app->post('/put/settings', 'uac', function() use ($app){
	if(isset($_POST['smtp'])){
		$email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
		$pw = filter_var($_POST['password'], FILTER_SANITIZE_STRING);
		$smtp = filter_var($_POST['smtp'], FILTER_SANITIZE_STRING);
		$protocol = filter_var($_POST['protocol'], FILTER_SANITIZE_STRING);
		$port = filter_var($_POST['port'], FILTER_SANITIZE_STRING);
		$app->sql->put('settings')->with([
			'email_email'		=> $email,
			'email_password'	=> $pw,
			'email_smtp'		=> $smtp,
			'email_protocol'	=> $protocol,
			'email_port'		=> $port,
		])->where('settingsID', '=', '1')->run();
	}elseif(isset($_POST['my'])){
		$email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
		$first = filter_var($_POST['first'], FILTER_SANITIZE_STRING);
		$last = filter_var($_POST['last'], FILTER_SANITIZE_STRING);
		$company = filter_var($_POST['company'], FILTER_SANITIZE_STRING);
		$phone = filter_var($_POST['phone'], FILTER_SANITIZE_STRING);
		
		$app->sql->put('master.uac')->with([
			'email'		=> $email,
			'first'		=> $first,
			'last'		=> $last,
			'company'	=> $company,
			'phone'		=> $phone,
		])->where('uacID', '=', $app->user['uacID'])->run();
	}
	$app->redirect($app->root.'/settings');
});