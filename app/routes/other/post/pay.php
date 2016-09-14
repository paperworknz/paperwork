<?php

$app->post('/post/pay', function() use ($app){
	/* Methods */
	$nonce = $_POST['payment_method_nonce'];
	
	/* Construction */
	
	
	// Create payment method
	$result = Braintree_PaymentMethod::create([
		'customerId' => $app->user['id'],
		'paymentMethodNonce' => $nonce,
	]);
	
	// Get Payment method token
	$paymentMethodToken = $result->paymentMethod->token;
	
	// Start subscription
	$result = Braintree_Subscription::create([
		'paymentMethodToken' => $paymentMethodToken,
		'planId' => 'Paperwork',
	]);
	
	// Log and end on error
	if(!$result->success){
		$app->event->log([
			'icon' => 'error.png',
			'text' => 'Error while applying subscription in Braintree.'.PHP_EOL.'Message: '.$result->message,
		]);
		$app->flash('error', 'There was a problem processing your card; please double check your payment information and try again. If you\'re out of options, flick us an email at hello@paperwork.nz');
		$app->redirect($app->root.'/app');
	}
	
	// -> successfully updated users payment method and applied new subscription
	
	// Promote user's privilege to 'user'
	if($app->user['privilege'] == 'trial'){
		$app->sql->put('user')->where('id', '=', $app->user['id'])->with([
			'privilege' => 'user'
		])->root()->run();
	}
	
	// Flash and redirect
	$app->event->log('Payment successful');
	$app->flash('success', 'Subscription applied successfully, account upgraded. Thanks!');
	$app->redirect($app->root.'/jobs');
});