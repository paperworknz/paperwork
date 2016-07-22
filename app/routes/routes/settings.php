<?php

$app->get('/settings', 'uac', function() use ($app){
	/* Methods */
	
	/* Construction */
	
	$settings = $app->module->require('settings');
	
	$app->build->page('views/settings.html', [
		'modules' => [
			'settings' => $settings,
		],
	]);
});