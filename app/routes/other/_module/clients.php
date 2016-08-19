<?php

$app->module->add('clients', 'user', function($request) use ($app){
	
	return [
		'third' => ['typeahead'],
	];
});