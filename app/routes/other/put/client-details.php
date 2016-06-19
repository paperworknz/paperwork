<?php

$app->post('/put/client-details', 'uac', function() use($app){
	/* Methods */
	$id = isset($_POST['id']) ? $_POST['id'] : false;
	$notes = isset($_POST['notes']) ? $_POST['notes'] : false;
	$name = isset($_POST['name']) ? $_POST['name'] : false;
	
	/* Construction */
	
	if($id && isset($_POST['notes'])){
		$notes = filter_var($_POST['notes'], FILTER_SANITIZE_STRING);
		$app->sql->put('client')->with([
			'notes' => $notes
		])->where('id', '=', $id)->run();
	}
	
	if($id && $name){
		$name = filter_var($_POST['name'], FILTER_SANITIZE_STRING);
		$address = filter_var($_POST['address'], FILTER_SANITIZE_STRING);
		$email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
		$phone = filter_var($_POST['phone'], FILTER_SANITIZE_STRING);
		$app->sql->put('client')->with([
			'name'		=> $name,
			'address'	=> $address,
			'email'		=> $email,
			'phone'		=> $phone
		])->where('id', '=', $id)->run();
	}
	
});