<?php

$app->get('/get/logout', function() use ($app){
	/* Methods */
	
	/* Construction */
	$app->event->log([
		'number' => 20,
		'title' => $app->user['username'].' logged out',
	]);
	
	$app->auth->logout();
});