<?php

$app->post('/put/settings', 'uac', function() use ($app){
	/* Methods */
	
	/* Construction */
	$email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
	$first = filter_var($_POST['first'], FILTER_SANITIZE_STRING);
	$last = filter_var($_POST['last'], FILTER_SANITIZE_STRING);
	$company = filter_var($_POST['company'], FILTER_SANITIZE_STRING);
	$phone = filter_var($_POST['phone'], FILTER_SANITIZE_STRING);
	$address = isset($_POST['address']) ? $_POST['address'] : $app->user['address'];
	
	if(!$app->sql->get('user')->where('email', '=', $email)->and('id', '<>', $app->user['id'])->root()->one()){
		
		$app->sql->put('user')->with([
			'email'		=> $email,
			'first'		=> $first,
			'last'		=> $last,
			'company'	=> $company,
			'phone'		=> $phone,
			'address'	=> $address,
		])->where('id', '=', $app->user['id'])->root()->run();
		
		$app->event->log('updated their details');
		
		$app->flash('success', 'Updated');
		$app->redirect($app->root.'/settings');
		
	}else{
		$app->event->log('tried to change their email address to another user\'s address: '.$email);
		
		$app->flash('error', 'Uh oh. Your new Email address already exists in Paperwork. Please contact support if you think this is wrong.');
		$app->redirect($app->root.'/settings');
	}
	
});