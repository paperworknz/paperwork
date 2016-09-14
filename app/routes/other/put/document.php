<?php

$app->post('/put/document', 'uac', function() use ($app){
	/* Methods */
	$id = isset($_POST['id']) ? $_POST['id'] : false;
	$document = isset($_POST['document']) ? $_POST['document'] : false;
	
	/* Construction */
	if(!$id) die($app->build->error('Document ID not provided'));
	if(!$document) die($app->build->error('Document JSON not provided'));
	
	$request = [
		'items' => [],
	];
	
	$format = ['name', 'date', 'reference', 'description', 'items', 'subtotal', 'tax', 'total'];
	
	foreach($document as $key => $value){
		
		if(in_array($key, $format)) $request[$key] = $value;
	}
	
	$request['items'] = $app->parse->arrayToJson($request['items']);
	
	$app->sql->put('document')->with($request)->where('id', '=', $id)->run();
	
	echo $app->build->success([
		'message' => "Document {$id} updated",
	]);
});