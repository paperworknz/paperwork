<?php

$app->get('/get/logout', function() use ($app){
	/* Methods */
	
	/* Construction */
	$app->event->log('logged out');
	
	$app->auth->logout();
});