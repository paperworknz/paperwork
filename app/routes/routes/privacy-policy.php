<?php

$app->get('/privacy-policy', 'app', function() use ($app){
	/* Methods */

	/* Construction */
	$app->event->log('browsed the privacy policy page with IP: '.$app->ip);
	$app->build->page('views/privacy-policy.html');
});