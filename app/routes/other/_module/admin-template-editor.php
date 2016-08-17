<?php

$app->module->add('admin-template-editor', function($request) use ($app){
	
	$templates = $app->parse->jsonToArray(file_get_contents('../app/app/resources/.template-cache'));
	
	if(!isset($request[0])) return;
	if(!isset($templates[$request[0]])) return;
	
	$file = $templates[$request[0]];
	
	if(!file_exists("../app/app/storage/templates/{$file}")) dd("Template {$file} does not exist in storage");
	$html = file_get_contents("../app/app/storage/templates/{$file}");
	
	return [
		'data' => [
			'template' => [
				'name' => $request[0],
				'html' => $html,
			],
		]
	];
});