<?php

$app->module->add('template', function($request) use ($app){
	
	$templates = $app->sql->get('job_form_template')->select(['id', 'name', 'content'])->all();
	$themes = $app->parse->jsonToArray(file_get_contents('../app/app/resources/.template-cache'));
	
	return [
		'behaviors' => ['tab'],
		'data' => [
			'templates' => $templates,
			'themes' => $themes,
		],
	];
});