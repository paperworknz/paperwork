<?php

$app->module->add('hello', 'user', function($request) use ($app){
	
	$timezone = include '../app/app/resources/timezone.php';
	
	return [
		'data' => [
			'timezone' => $timezone,
		]
	];
});