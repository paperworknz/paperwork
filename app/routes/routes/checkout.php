<?php

$app->get('/checkout', 'baby', function() use ($app){
	/* Methods */
	
	/* Construction */
	$checkout = $app->module->require('checkout');
	
	$app->build->page('views/checkout.html', [
		'modules' => [
			'checkout' => $checkout,
		],
	]);
});