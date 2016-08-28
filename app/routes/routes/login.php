<?php

$app->get('/login', 'app', function() use ($app){
	/* Methods */
	
	/* Construction */
	$app->event->log('browsed the login page with IP: '.$app->ip);
	$app->build->page('views/login.html');
});