<?php

$app->post('/put/email-signature', 'uac', function() use ($app){
	/* Methods */
	$signature = isset($_POST['signature']) ? $_POST['signature'] : false;
	
	/* Construction */
	
	if($app->sql->get('user_email')->select('user_id')->run()){
		$app->sql->put('user_email')->with([
			'signature'	=> $signature,
		])->run();
	}else{
		$app->sql->post('user_email')->with([
			'signature'	=> $signature,
		])->run();
	}
	
	$app->event->log('updated their email signature');
	$app->flash('success', 'Updated');
	$app->redirect($app->root.'/settings');
});