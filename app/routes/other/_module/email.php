<?php

$app->module->add('email', 'user', function($request) use ($app){
	
	$email = $app->sql->get('user_email')->one();
	
	return [
		'data' => [
			'email' => $email
		],
	];
});