<?php

$app->module->add('admin', 'admin', function($request) use ($app){
	
	return [
		'behaviors' => ['tab'],
	];
});