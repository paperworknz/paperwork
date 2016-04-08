<?php

$app->get('/', 'app', function() use($app){
	/* Methods */
	
	/* Construction */
	$IP = $_SERVER['REMOTE_ADDR'];
	
	if($IP != '::1'){
		$app->event->log([
			'number' => 0,
			'title' => 'Landing Page',
			'text' => 'IP: '.$IP
		]);
	}
	$app->build->page('views/home.html', [
		'register' => false
	]);
});