<?php

$app->get('/about', 'app', function() use ($app){
	/* Methods */

	/* Construction */
	$app->event->log('browsed the about page with IP: '.$app->ip);
	$app->build->page('views/about.html');
});