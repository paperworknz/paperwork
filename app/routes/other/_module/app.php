<?php

$app->module->add('app', 'user', function($request) use ($app){
	
	return [
		'behaviors' => ['document'],
	];
});