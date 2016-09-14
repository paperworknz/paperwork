<?php

$app->get('/app', 'uac', function() use ($app){
	/* Methods */
	
	/* Construction */
	
	$item = $app->sql->get('inventory')->where('name', '=', '()')->one();
	
	$app_data = $app->module->require('app');
	
	$app->build->page('views/app.html', [
		'modules' => [
			'app' => $app_data,
		],
	]);
});