<?php

$app->get('/login', 'app', function() use ($app){
	/* Methods */

	/* Construction */
	$app->build->page('views/login.html');
});