<?php

$app->get('/privacy-policy', 'app', function() use ($app){
	/* Methods */

	/* Construction */
	$app->event->log('browsed the Privacy Policy page with IP: '.$IP);
	$app->build->page('views/privacy-policy.html');
});