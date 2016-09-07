<?php

$app->post('/put/settings', 'uac', function() use ($app){
	/* Methods */
	
	/* Construction */
	$email = isset($_POST['email']) ? filter_var($_POST['email'], FILTER_VALIDATE_EMAIL) : $app->user['email'];
	$first = isset($_POST['first']) ? filter_var($_POST['first'], FILTER_SANITIZE_STRING) : $app->user['first'];
	$last = isset($_POST['last']) ? filter_var($_POST['last'], FILTER_SANITIZE_STRING) : $app->user['last'];
	$company = isset($_POST['company']) ? filter_var($_POST['company'], FILTER_SANITIZE_STRING) : $app->user['company'];
	$phone = isset($_POST['phone']) ? filter_var($_POST['phone'], FILTER_SANITIZE_STRING) : $app->user['phone'];
	$address = isset($_POST['address']) ? $_POST['address'] : $app->user['address'];
	$timezone = isset($_POST['timezone']) ? $_POST['timezone'] : $app->user['timezone'];
	$tax = isset($_POST['tax']) ? $_POST['tax'] : $app->user['tax'];
	
	$user = $app->sql->get('user')->where('email', '=', $email)->and('id', '<>', $app->user['id'])->root()->one();
	
	if($user && $email != 'your@email.com') {
		$app->event->log('tried to change their email address to another user\'s address: '.$email);
		
		$app->flash('error', 'Uh oh. Your new Email address already exists in Paperwork. Please contact support if you think this is wrong.');
		$app->redirect($app->root.'/settings');
	}
	
	$app->sql->put('user')->with([
		'email'		=> $email,
		'first'		=> $first,
		'last'		=> $last,
		'company'	=> $company,
		'phone'		=> $phone,
		'address'	=> $address,
		'timezone'	=> $timezone,
		'tax'		=> $tax,
	])->where('id', '=', $app->user['id'])->root()->run();
	
	$app->event->log('updated their details');
	
	if(isset($_POST['hello'])){
		$app->flash('success', "Hi {$first}! This is your list of jobs, you can get here using the <b>menu</b>. Click the default job below and use the <b>tabs</b> to navigate!");
		$app->redirect($app->root.'/jobs');
	}
	
	$app->flash('success', 'Updated');
	$app->redirect($app->root.'/settings');
});