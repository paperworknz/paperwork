<?php

$app->post('/put/email-settings', 'uac', function() use ($app){
	/* Methods */
	$address = isset($_POST['address']) ? $_POST['address'] : false;
	$smtp = isset($_POST['smtp']) ? $_POST['smtp'] : false;
	$protocol = isset($_POST['protocol']) ? $_POST['protocol'] : false;
	$port = isset($_POST['port']) ? $_POST['port'] : false;
	
	/* Construction */
	$user_email = $app->sql->get('user_email')->select('user_id')->one();
	
	if(!$user_email){
		$app->sql->post('user_email')->with([
			'address' => $address,
			'smtp' => $smtp,
			'protocol' => $protocol,
			'port' => $port,
		])->run();
		
		$app->event->log('updated their email settings');
		$app->flash('success', 'Updated');
		$app->redirect($app->root.'/settings');
	}
	
	$app->sql->put('user_email')->with([
		'address' => $address,
		'smtp' => $smtp,
		'protocol' => $protocol,
		'port' => $port,
	])->run();
	
	$app->event->log('updated their email settings');
	$app->flash('success', 'Updated');
	$app->redirect($app->root.'/settings');
});