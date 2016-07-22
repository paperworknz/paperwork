<?php

$app->get('/inventory', 'uac', function() use ($app){
	/* Methods */
	
	/* Construction */
	$inventory = $app->module->require('inventory');
	
	$app->build->page('views/inventory.html', [
		'modules' => [
			'inventory' => $inventory,
		],
	]);
});