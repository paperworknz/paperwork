<?php

$app->get('/login', 'app', function() use ($app){
	/* Methods */

	/* Construction */
	if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
		$IP = $_SERVER['HTTP_CLIENT_IP'];
	} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
		$IP = $_SERVER['HTTP_X_FORWARDED_FOR'];
	} else {
		$IP = $_SERVER['REMOTE_ADDR'];
	}
	
	if($IP != '::1' && $IP != '127.0.0.1' && $IP != '222.152.212.0'){
		$app->event->log([
			'number' => 0,
			'title' => 'Landing Page',
			'text' => 'IP: '.$IP
		]);
	}
	
	$app->build->page('views/login.html', [
		'register' => $app->env['user_registration'],
		'maintenance' => $app->env['maintenance']
	]);
});