<?php

ini_set('display_errors', 'on');
$app->config('debug', true);

$app->get('/get/braintree-token', function() use ($app){
	/* Methods */
	
	/* Construction */
	echo Braintree_ClientToken::generate();
	
});