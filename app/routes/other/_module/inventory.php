<?php

$app->module->add('inventory', 'user', function($request) use ($app){
	
	$inventory = $app->sql->get('inventory')->select(['id', 'name', 'price'])->also('ORDER BY id DESC')->all();
	
	// HTML special char because name, val is rendered in attribute
	foreach($inventory as $key => $item) $inventory[$key]['name'] = htmlspecialchars($item['name']);
	
	return [
		'data' => [
			'inventory' => $inventory,
		]
	];
});