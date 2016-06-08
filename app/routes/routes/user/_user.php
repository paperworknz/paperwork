<?php

// ADMIN ONLY //

$app->get('/user', 'admin', function() use ($app){
	/* Methods */
	
	/* Construction */
	$app->redirect($app->root.'/user/0');
});

$app->get('/user/:a', 'admin', function($a) use ($app){
	/* Methods */
	
	/* Construction */
	if($user = $app->sql->get('user')->where('id', '=', $a)->root()->one()){
		return $app->build->page('views/user/_user.html', [
			'host' => $user,
		]);
	}else{
		$user = [
			'id' => 'Guest'
		];
		return $app->build->page('views/user/_user.html', [
			'host' => $user,
		]);
	}
}); 