<?php

$app->module->add('clients', function($request) use ($app){
	
	return [
		'third' => ['typeahead'],
	];
});