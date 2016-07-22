<?php

$app->get('/clients', 'uac', function() use ($app){
	/* Methods */
	
	/* Construction */
	$clients = $app->module->require('clients');
	
	$app->build->page('views/clients.html', [
		'modules' => [
			'clients' => $clients,
		],
	]);
});