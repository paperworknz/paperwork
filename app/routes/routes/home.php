<?php

$app->get('/', 'app', function() use($app){
	/* Methods */
	
	/* Construction */
	$app->event->log('browsed the landing page with IP: '.$app->ip);
	$app->build->page('views/home.html');
});