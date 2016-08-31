<?php

$app->get('/', 'app', function() use($app){
	/* Methods */
	
	/* Construction */
	$now = new DateTime();
	$future = new DateTime('2016-09-03 00:00:00');
	
	$remaining = $future->getTimestamp() - $now->getTimestamp();
	
	$app->event->log('browsed the landing page with IP: '.$app->ip);
	$app->build->page('views/home.html', [
		'remaining' => $remaining,
	]);
});