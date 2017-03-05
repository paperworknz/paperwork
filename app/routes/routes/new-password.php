<?php

$app->get('/new-password', 'uac', function() use ($app){
	/* Methods */

	/* Construction */
	$app->build->page('views/new-password.html');
});