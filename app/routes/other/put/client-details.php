<?php

$app->post('/put/client-details', 'uac', function() use($app){
	if(isset($_POST['notes']) && isset($_POST['clientID'])){
		$notes = filter_var($_POST['notes'], FILTER_SANITIZE_STRING);
		$app->sql->put('client')->with(['notes' => $notes])->where('clientID', '=', $_POST['clientID'])->run();
	}
	if(isset($_POST['name']) && isset($_POST['clientID'])){
		$name = filter_var($_POST['name'], FILTER_SANITIZE_STRING);
		$address = filter_var($_POST['address'], FILTER_SANITIZE_STRING);
		$email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
		$phone = filter_var($_POST['phone'], FILTER_SANITIZE_STRING);
		$app->sql->put('client')->with([
			'name'		=> $name,
			'address'	=> $address,
			'email'		=> $email,
			'phone'		=> $phone
		])->where('clientID', '=', $_POST['clientID'])->run();
	}
});