<?php

$app->get('/get/clients', 'uac', function() use ($app){
	/* Methods */
	
	/* Construction */
	$clients = $app->sql->get('client')->select(['name', 'client_number'])->also('ORDER BY date_created DESC')->all();
	
	echo $app->parse->arrayToJson($clients);
});