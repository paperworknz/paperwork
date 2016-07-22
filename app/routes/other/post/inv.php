<?php

$app->post('/post/inv', 'uac', function() use ($app){
	/* Methods */
	$name = isset($_POST['name']) ? trim($_POST['name']) : false;
	$price = isset($_POST['price']) ? trim($_POST['price']): false;
	
	/* Construction */
	if(!$name){
		die($app->build->error('Inventory name not provided'));
	}
	
	if(!$price){
		$price = 0;
	}
	
	if($app->sql->get('inventory')->where('name', '=', $name)->one()){
		
		$app->sql->put('inventory')->with([
			'name' => $name,
			'price' => $price,
		])->where('name', '=', $name)->run();
		
		$app->event->log('updated inventory item: '.$name);
		
	}else{
		
		$app->sql->post('inventory')->with([
			'name' => $name,
			'price' => $price,
		])->run();
		
		$app->event->log('created inventory item: '.$name);
		
	}
	
	$item = $app->sql->get('inventory')->where('name', '=', $name)->one();
	
	echo $app->parse->arrayToJson($item);
	
});