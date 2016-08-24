<?php

$app->post('/put/inventory', 'uac', function() use ($app){
	/* Methods */
	$id = isset($_POST['id']) ? trim($_POST['id']) : false;
	$name = isset($_POST['name']) ? trim($_POST['name']) : false;
	$price = isset($_POST['price']) ? trim($_POST['price']): false;
	
	/* Construction */
	if(!$id){
		die($app->build->error('Inventory ID not provided'));
	}
	
	if(!$name){
		die($app->build->error('Inventory name not provided'));
	}
	
	if(!$price) $price = 0;
	
	$app->sql->put('inventory')->where('id', '=', $id)->with([
		'name'	=> $name,
		'price'	=> $price,
	])->run();
	
	$app->event->log('updated inventory item: '.$name);
	$item = $app->sql->get('inventory')->where('id', '=', $id)->one();
	
	echo $app->parse->arrayToJson($item);
	
});