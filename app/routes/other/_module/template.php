<?php

$app->module->add('template', function($request) use ($app){
	
	$path = '../public/css/media/icon/templates';
	$themes = [];
	
	// foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path)) as $filename => $file) {
	// 	$file = str_replace($path, '', $file);
	// 	$file = str_replace('\\', '/', $file);
	// 	$file = str_replace('/..', '/', $file);
	// 	$file = str_replace('/.', '/', $file);
	// 	if(substr($file, -1) != '/'){
	// 		$file = str_replace('.png', '', $file);
	// 		$file = str_replace('/', '', $file);
	// 		array_push($themes, $file);
	// 	}
	// }
	
	return [
		'behaviors' => ['tab'],
		'data' => [
			'templates' => $app->sql->get('job_form_template')->select(['id', 'name', 'content'])->all(),
			'themes' => $themes,
		],
	];
});