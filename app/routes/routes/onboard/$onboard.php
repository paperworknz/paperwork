<?php

$app->get('/onboard/:a', 'uac', function($request) use ($app){
	/* Methods */
	
	/* Construction */
	$onboard = $app->module->require('onboard', [$request]);
	
	$app->build->page('views/onboard/$onboard.html', [
		'modules' => [
			'onboard' => $onboard,
		],
	]);
});