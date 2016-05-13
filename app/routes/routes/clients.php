<?php

$app->get('/clients', 'uac', function() use ($app){
	/* Methods */
	
	/* Construction */
	$clients = $app->sql->get('client')->select(['name', 'client_number'])->also('ORDER BY date_created DESC')->all();
	
	$app->build->page('views/clients.html', [
		'clients' => $clients,
	]);
});