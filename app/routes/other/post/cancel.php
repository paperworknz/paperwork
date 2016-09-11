<?php

$app->post('/post/cancel', 'uac', function() use ($app){
	/* Methods */
	
	
	/* Construction */
	
	// Get braintree customer
	try {
		$result = Braintree_Customer::delete($app->user['id']);
	}catch(Braintree_Exception_NotFound $e){
		$app->event->log([
			'icon' => 'error.png',
			'text' => 'Error while deleting customer in Braintree.',
		]);
		die($app->build->error("We ran into a problem cancelling your subscription, we have been notified and will resolve it as soon as possible. Sorry about this."));
	}
	
	$app->sql->put('user')->with([
		'disabled' => 1, 
	])->where('id', '=', $app->user['id'])->root()->run();
	
	$app->event->log('cancelled their subscription and account');
	
	echo $app->build->success([
		'message' => 'Client subscription removed'
	]);
});