<?php

$app->post('/put/document-json', 'uac', function() use ($app){
	/* Methods */
	$id = isset($_POST['id']) ? $_POST['id'] : false;
	$json = isset($_POST['json']) ? $_POST['json'] : false;
	
	/* Construction */
	if(!$id) die($app->build->error('Document ID not provided'));
	
	$app->sql->put('document')->where('id', '=', $id)->with([
		'json' => $json,
	])->run();
});