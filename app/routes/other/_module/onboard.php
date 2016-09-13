<?php

$app->module->add('onboard', 'user', function($request) use ($app){
	
	$currency = include '../app/app/resources/currency.php';
	$timezone = include '../app/app/resources/timezone.php';
	
	return [
		'data' => [
			'currency' => $currency,
			'timezone' => $timezone,
		]
	];
});