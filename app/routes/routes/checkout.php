<?php

$app->get('/checkout', 'uac', function() use ($app){
	/* Methods */
	
	/* Construction */
	$checkout = $app->module->require('checkout');
	
	$app->build->page('views/checkout.html', [
		'modules' => [
			'checkout' => $checkout,
		],
	]);
});