<?php

$app->get('/register-settings', 'uac', function() use ($app){
	/* Methods */

	/* Construction */
	$app->build->page('views/register-settings.html');
});