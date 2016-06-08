<?php

$app->get('/register', 'app', function() use ($app){
	/* Methods */

	/* Construction */
	$app->event->log('browsed the registration page with IP: '.$app->ip);
	
	if(!$app->env['user_registration']){
		$app->flash('info', 'Please email us at <a href="mailto:hello@paperwork.nz">hello@paperwork.nz</a> if you\'re interested in a free trial, we\'re looking for people just like you!');
		$app->redirect($app->root);
	}
	
	$app->build->page('views/register.html');
});