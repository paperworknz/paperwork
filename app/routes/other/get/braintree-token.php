<?php

$app->get('/get/braintree-token', function() use ($app){
	/* Methods */
	
	/* Construction */
	echo Braintree_ClientToken::generate();
	
});