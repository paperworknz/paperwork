<?php

$app->post('/put/template', 'uac', function() use ($app){
	/* Methods */
	$id = isset($_POST['id']) ? $_POST['id'] : false;
	$name = isset($_POST['name']) ? $_POST['name'] : false;
	
	/* Construction */
	if(!$id){
		die($app->build->error('Template ID not provided'));
	}
	
	if(!$name){
		die($app->build->error('Template name not provided'));
	}
	
	$app->sql->put('user_template')->with([
		'name' => $name
	])->where('id', '=', $id)->run();
	
	echo $app->build->success([
		'message' => 'name updated',
	]);
});