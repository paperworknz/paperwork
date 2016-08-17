<?php

$app->get('/get/template-properties', 'uac', function() use ($app){
	/* Methods */
	
	/* Construction */
	$properties = $app->sql->get('user_template_properties')->one();
	
	unset(
		$properties['id'],
		$properties['user_id'],
		$properties['date_created'],
		$properties['date_touched'],
		$properties['date_deleted']
	);
	
	$user = [
		'user-name' => $app->user['first'].' '.$app->user['last'],
		'user-company' => $app->user['company'],
		'user-email' => $app->user['email'],
		'user-address' => $app->user['address'],
		'user-phone' => $app->user['phone'],
	];
	
	$response = array_merge($user, $properties);
	
	echo $app->parse->arrayToJson($response);
});