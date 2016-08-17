<?php

$app->get('/template/:a', 'admin', function($request) use ($app){
	/* Methods */
	
	/* Construction */
	$template = $app->module->require('admin-template-editor', [$request]);
	
	$app->build->page('views/template/$template.html', [
		'modules' => [
			'admin-template-editor' => $template,
		],
	]);
});