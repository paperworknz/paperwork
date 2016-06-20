<?php

$app->get('/client/$client', 'uac', function() use ($app){
	/* Methods */

	/* Construction */
	$app->build->page('views/client/$client.html');
});