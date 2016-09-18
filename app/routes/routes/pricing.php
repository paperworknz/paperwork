<?php

$app->get('/pricing', 'app', function() use ($app){
	/* Methods */

	/* Construction */
	$app->event->log('browsed the pricing page with IP: '.$app->ip);
	$app->build->page('views/pricing.html');
});