<?php

$app->get('/register', 'app', function() use ($app){
	/* Methods */

	/* Construction */
	if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
		$IP = $_SERVER['HTTP_CLIENT_IP'];
	} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
		$IP = $_SERVER['HTTP_X_FORWARDED_FOR'];
	} else {
		$IP = $_SERVER['REMOTE_ADDR'];
	}
	
	if($IP != '::1' && $IP != '127.0.0.1' && $IP != '222.152.212.0') $app->event->log('browsed the registration page with IP: '.$IP);
	
	if(!$app->env['user_registration']){
		$app->flash('info', 'Please email us at <a href="mailto:hello@paperwork.nz">hello@paperwork.nz</a> if you\'re interested in a free trial, we\'re looking for people just like you!');
		$app->redirect($app->root);
	}
	$app->build->page('views/register.html');
});