<?php

// ADMIN ONLY //

$app->get('/user', 'uac', 'admin', function() use ($app){
	/* Methods */
	
	/* Construction */
	$app->redirect($app->root.'/user/0');
});

$app->get('/user/:a', 'uac', 'admin', function($a) use ($app){
	/* Methods */
	
	/* Construction */
	if($user = $app->sql->get('user')->where('id', '=', $a)->root()->one()){
		return $app->build->page('views/user/$user.html', [
			'host' => $user,
		]);
	}else{
		$user = [
			'id' => 'Guest'
		];
		return $app->build->page('views/user/$user.html', [
			'host' => $user,
		]);
	}
}); 