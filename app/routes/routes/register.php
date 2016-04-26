<?php

$app->get('/register', 'app', function() use ($app){
	/* Methods */

	/* Construction */
	if(!$app->env['user_registration']){
		$app->redirect($app->root);
	}
	$app->build->page('views/register.html');
});