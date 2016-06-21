<?php

$app->error(function($e) use ($app){
	$app->event->log([
		'text' => 'ran into an error on '.$app->request->getResourceUri(),
		'icon' => 'error.png',
	]);
	$app->flash('error', 'Something went wrong... Please try again. Otherwise, <b>if it\'s urgent please get in touch</b>. We are sorry for the inconvenience!');
	$app->redirect($app->root.'/app');
});