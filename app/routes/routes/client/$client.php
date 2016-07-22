<?php

$app->get('/client/:a', 'uac', function($a) use ($app){
	/* Methods */
	
	/* Construction */
	
	$client = $app->module->require('client', [$a]);
	
	$app->build->page('views/client/$client.html', [
		'modules' => [
			'client' => $client,
		],
	]);
}); 