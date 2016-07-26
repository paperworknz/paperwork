<?php

$app->get('/template/:a', 'admin', function($request) use ($app){
	/* Methods */
	
	/* Construction */
	$template = $app->module->require('$template', [$request]);
	
	$app->build->page('views/template/$template.html', [
		'modules' => [
			'$template' => $template,
		],
	]);
});