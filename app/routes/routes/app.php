<?php

$app->get('/app', 'uac', function() use ($app){
	/* Methods */
	$backup = new \Paperwork\Extended\SQLBackup;
	
	/* Construction */
	$app->build->page('views/app.html');
});