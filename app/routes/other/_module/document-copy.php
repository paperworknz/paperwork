<?php

$app->module->add('document-copy', function($request) use ($app){
	
	$templates = $app->sql->get('user_template')->retain(['template_id'])->all();
	
	return [
		'data' => [
			'templates' => $templates,
		],
	];
});