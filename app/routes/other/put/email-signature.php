<?php

$app->post('/put/email-signature', 'uac', function() use ($app){
	/* Methods */
	
	/* Construction */
	$signature = $_POST['signature'];
	
	if($app->sql->get('user_email_settings')->select('user_id')->run()){
		$app->sql->put('user_email_settings')->with([
			'signature'	=> $signature,
		])->where('user_id', '=', $app->user['id'])->run();
	}else{
		$app->sql->post('user_email_settings')->with([
			'signature'	=> $signature,
		])->run();
	}
	
	$app->flash('success', 'Updated');
	$app->redirect($app->root.'/settings');
});