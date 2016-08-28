<?php

$app->get('/get/recover', 'app', function() use($app){
	/* Methods */
	
	/* Construction */
	$email = isset($_GET['email']) ? $_GET['email'] : false;
	$id = isset($_GET['id']) ? $_GET['id'] : false;
	
	if(!$email){
		$app->flash('error', "Sorry, we couldn't find that email address");
		$app->redirect($app->root);
	}
	
	if(!$id){
		$app->event->log([
			'icon' => 'error.png',
			'text' => "User {$email} tried to recover their password but no identifier string was passed",
		]);
		$app->flash('error', 'Sorry, there was a problem with our recovery service. Please email us at hello@paperwork.nz!');
		$app->redirect($app->root);
	}
	
	$user = $app->sql->get('user')->where('email', '=', $email)->and('recover', '=', $id)->root()->one();
	
	if(!$user){
		$app->flash('error', 'Sorry, it appears your reset request has expired. Please try again, or email us at hello@paperwork.nz');
		$app->redirect($app->root);
	}
	
	// Third param = force login, password not used
	$login = $app->auth->login($user['id'], '', true);
	
	if($login != 'Authenticated Successfully'){
		$app->event->log([
			'icon' => 'error.png',
			'text' => "User {$email} recovery identifier was OK but failed to login",
		]);
		
		$app->flash('error', 'Sorry, there was a problem with our recovery service. Please email us at hello@paperwork.nz!');
		$app->redirect($app->root);
	}
	
	// Clear recover token
	$app->sql->put('user')->where('email', '=', $email)->with([
		'recover' => '',
	])->root()->run();
	
	// Log
	$app->event->log("User {$email} recovered their account successfully");
	
	// Return
	$app->flash('success', 'Account verified. Please update your password now!');
	$app->redirect($app->root.'/settings');
});