<?php

$app->get('/clients', 'uac', function() use ($app){
	/* Methods */
	
	/* Construction */
	$app->build->page('views/clients.html', [
		'client'	=> $app->sql->get('client')->by('clientID DESC')->all()->run()
	]);
});