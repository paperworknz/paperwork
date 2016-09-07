<?php

$app->get('/hello', 'uac', function() use ($app){
	/* Methods */
	
	/* Construction */
	$hello = $app->module->require('hello');
	
	$app->build->page('views/hello.html', [
		'modules' => [
			'hello' => $hello,
		],
	]);
});