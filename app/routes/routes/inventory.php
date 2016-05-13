<?php

$app->get('/inventory', 'uac', function() use ($app){
	/* Methods */
	
	/* Construction */
	$inventory = $app->sql->get('inventory')->also('ORDER BY id DESC')->all();
	
	$app->build->page('views/inventory.html', [
		'inventory' => $inventory,
	]);
});