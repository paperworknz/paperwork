<?php

$app->post('/post/vote', 'uac', function() use ($app){
	/* Methods */
	
	/* Construction */
	$app->event->log([
		'text' => $app->user['company'].' voted for template logos',
	]);
});