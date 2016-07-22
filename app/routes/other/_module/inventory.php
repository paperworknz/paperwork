<?php

$app->module->add('inventory', function($request) use ($app){
	
	$inventory = $app->sql->get('inventory')->select(['id', 'name', 'price'])->also('ORDER BY id DESC')->all();
	
	return [
		'data' => [
			'inventory' => $inventory,
		]
	];
});