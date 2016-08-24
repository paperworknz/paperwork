<?php

$app->module->add('user', 'user', function($request) use ($app){
	
	if(!$user = $app->sql->get('user')->where('id', '=', $request[0])->root()->one()){
		$user = [
			'id' => 'Guest',
		];
	}
	
	return [
		'behaviors' => ['tab'],
		'data' => [
			'host' => $user,
		],
	];
});