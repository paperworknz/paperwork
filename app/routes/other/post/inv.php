<?php

$app->post('/post/inv', 'uac', function() use ($app){
	/* Methods */
	$name = isset($_POST['name']) ? $_POST['name'] : false;
	$price = isset($_POST['price']) ? $_POST['price'] : false;
	
	/* Construction */
	if($name != '' && $price != ''){
		
		//$name = preg_replace('/\s+/', ' ', $name);
		if($app->sql->get('inventory')->where('name', '=', $name)->one()){
			$app->sql->put('inventory')->with([
				'name' => $name,
				'price' => $price,
			])->where('name', '=', $name)->run();
		}else{
			$app->sql->post('inventory')->with([
				'name' => $name,
				'price' => $price,
			])->run();
		}
	}else{
		echo '0';
	}
});