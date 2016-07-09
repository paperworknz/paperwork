<?php

$app->get('/checkout', 'baby', function() use ($app){
	/* Methods */
	
	/* Construction */
	$app->build->page('views/checkout.html');
});