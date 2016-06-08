<?php

$app->post('/post/play-video', 'app', function() use ($app){
	/* Methods */
	
	/* Construction */
	$app->event->log('played the '.$_POST['video'].' video with IP: '.$app->ip);
});