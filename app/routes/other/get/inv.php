<?php

$app->get('/get/inv', 'uac', function() use ($app){
	/* Methods */
	
	/* Construction */
	$data = [];
	if($inventory = $app->sql->get('inventory')->select(['name', 'price'])->all()){
		foreach($inventory as $item){
			$data[$item['name']] = $item['price'];
		}
	}
	
	echo $app->parse->arrayToJson($data);
});