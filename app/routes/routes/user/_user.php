<?php

// ADMIN ONLY //

$app->get('/user', 'admin', function() use ($app){
	/* Methods */
	
	/* Construction */
	$app->redirect($app->root.'/user/1');
});

$app->get('/user/:a', 'admin', function($a) use ($app){
	/* Methods */
	
	/* Construction */
	if($user = $app->sql->get('user')->where('id', '=', $a)->god()->one()){
		
		return $app->build->page('views/user/_user.html', [
			'host' => $user,
		]);
		
	}else{
		$app->flash('error', 'User id '.$a.' not found');
		$app->redirect($app->root.'/user/1');
	}
}); 