<?php

$app->post('/put/client-details', 'uac', function() use($app){
	/* Methods */
	$id = isset($_POST['id']) ? $_POST['id'] : false;
	$name = isset($_POST['name']) ? $_POST['name'] : false;
	$email = isset($_POST['email']) ? $_POST['email'] : false;
	$phone = isset($_POST['phone']) ? $_POST['phone'] : false;
	$address = isset($_POST['address']) ? $_POST['address'] : false;
	$notes = isset($_POST['notes']) ? $_POST['notes'] : false;
	
	/* Construction */
	if($id && isset($_POST['notes'])){
		$app->sql->put('client')->with([
			'notes' => $notes
		])->where('id', '=', $id)->run();
	}
	
	if($id && $name){
		$app->sql->put('client')->with([
			'name'		=> $name,
			'address'	=> $address,
			'email'		=> $email,
			'phone'		=> $phone
		])->where('id', '=', $id)->run();
	}
});