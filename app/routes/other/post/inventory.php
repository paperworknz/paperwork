<?php

$app->post('/post/inventory', 'uac', function() use ($app){
	/* Methods */
	$name = isset($_POST['name']) ? $_POST['name'] : false;
	$price = isset($_POST['price']) ? $_POST['price'] : false;
	
	/* Construction */
	if(!$name){
		die($app->build->error('Inventory name not provided'));
	}
	
	if(!$price){
		$price = 0;
	}
	
	$item = $app->sql->get('inventory')->where('name', '=', $name)->one();
	
	if($item){
		
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