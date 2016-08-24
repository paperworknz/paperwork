<?php

$app->post('/put/rename-document', 'uac', function() use ($app){
	/* Methods */
	$id = isset($_POST['id']) ? $_POST['id'] : false;
	$name = isset($_POST['name']) ? $_POST['name'] : false;
	
	/* Construction */
	if(!$id) die($app->build->error('Document ID not provided'));
	if(!$name) die($app->build->error('Document name not provided'));
	
	$app->sql->put('document')->with([
		'name' => $name,
	])->where('id', '=', $id)->run();
	
	echo $app->build->success([
		'name' => $name
	]);
});