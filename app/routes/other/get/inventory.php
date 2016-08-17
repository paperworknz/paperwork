<?php

$app->get('/get/inventory', 'uac', function() use ($app){
	/* Methods */
	
	/* Construction */
	$inventory = $app->sql->get('inventory')->select(['name', 'price'])->all();
	
	echo $app->parse->arrayToJson($inventory);
});