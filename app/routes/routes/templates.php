<?php

$app->get('/templates', 'uac', function() use ($app){
	/* Methods */

	/* Construction */
	$template = $app->module->require('template');
	
	$app->build->page('views/templates.html', [
		'modules' => [
			'template' => $template,
		],
	]);
});