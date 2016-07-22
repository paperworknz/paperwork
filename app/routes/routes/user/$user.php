<?php

// ADMIN ONLY //

$app->get('/user', 'uac', 'admin', function() use ($app){
	/* Methods */
	
	/* Construction */
	$app->redirect($app->root.'/user/0');
});

$app->get('/user/:a', 'uac', 'admin', function($request) use ($app){
	/* Methods */
	
	/* Construction */
	$user = $app->module->require('user', [$request]);
	
	$app->build->page('views/user/$user.html', [
		'modules' => [
			'user' => $user,
		],
	]);
}); 