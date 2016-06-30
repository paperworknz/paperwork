<?php

$app->get('/get/register', 'uac', function() use ($app){
	/* Methods */
	
	/* Construction */
	$app->auth->logout($app->root.'/register');
});