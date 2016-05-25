<?php

$app->post('/post/inv', 'uac', function() use ($app){
	/* Methods */
	$name = isset($_POST['name']) ? $_POST['name'] : false;
	$price = isset($_POST['price']) ? $_POST['price'] : false;
	
	/* Construction */
	if($name != '' && $price != ''){
		
		//$name = preg_replace('/\s+/', ' ', $name);
		if($app->sql->get('inventory')->where('name', '=', $name)->one()){
			
			$app->event->log('updated inventory item: '.$name);
			
			$app->sql->put('inventory')->with([
				'name' => $name,
				'price' => $price,
			])->where('name', '=', $name)->run();
		}else{
			
			$app->event->log('created inventory item: '.$name);
			
			$app->sql->post('inventory')->with([
				'name' => $name,
				'price' => $price,
			])->run();
		}
	}else{
		echo '0';
	}
});