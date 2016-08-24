<?php

$app->post('/post/pay', function() use ($app){
	/* Methods */
	$nonce = $_POST['payment_method_nonce'];
	
	/* Construction */
	
	//
	//
	// Search for customer
	try {
		
		$result = Braintree_Customer::find($app->user['id']);
		$paymentMethodToken = $result->paymentMethods[0]->token;
		
	} catch(Braintree_Exception_NotFound $e){
		
		//
		//
		// Make new customer
		$result = Braintree_Customer::create([
			'id' => $app->user['id'],
			'firstName' => $app->user['first'],
			'lastName' => $app->user['last'],
			'company' => $app->user['company'],
			'email' => $app->user['email'],
			'paymentMethodNonce' => $nonce,
		]);
		
		// Log and end on error
		if(!$result->success){
			$app->event->log([
				'icon' => 'error.png',
				'text' => 'Error while creating a new customer in Braintree.'.PHP_EOL.'Message: '.$result->message,
			]);
			$app->flash('error', 'We ran into a problem setting you up. This is our fault and we\'ll get in touch as soon as possible. Sorry!');
			$app->redirect($app->root.'/checkout');
		}
		
		$paymentMethodToken = $result->customer->paymentMethods[0]->token;
	}
	
	//
	//
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
		$app->redirect($app->root.'/checkout');
	}
	
	//
	//
	// -> successfully created a new customer, their payment method, and a new subscription
	
	// Promote user's privilege to 'user'
	if($app->user['privilege'] == 'baby'){
		$app->sql->put('user')->where('id', '=', $app->user['id'])->with([
			'privilege' => 'user'
		])->root()->run();
	}
	
	// Flash and redirect
	$app->flash('success', 'Payment successful. Welcome to Paperwork!'.PHP_EOL.'Please see our introductionary email for further information.');
	$app->redirect($app->root.'/app');
	
});