<?php

$app->get('/features', 'app', function() use ($app){
	/* Methods */

	/* Construction */
	$app->event->log('browsed the features page with IP: '.$app->ip);
	$app->build->page('views/features.html');
});