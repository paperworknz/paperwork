<?php

$app->get('/app', 'uac', function() use ($app){
	/* Methods */
	
	/* Construction */
	$app->build->page('views/app.html');
}); 