<?php

$app->post('/post/play-video', 'app', function() use ($app){
	/* Methods */
	
	/* Construction */
	if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
		$IP = $_SERVER['HTTP_CLIENT_IP'];
	} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
		$IP = $_SERVER['HTTP_X_FORWARDED_FOR'];
	} else {
		$IP = $_SERVER['REMOTE_ADDR'];
	}
	
	$app->event->log('played the '.$_POST['video'].' video with IP: '.$IP);
});