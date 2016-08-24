<?php

$app->post('/delete/inventory', 'uac', function() use ($app){
	/* Methods */
	$id = isset($_POST['id']) ? $_POST['id'] : false;
	
	/* Construction */
	if(!$id){
		die($app->build->error('Inventory ID not provided'));
	}
	
	$app->sql->delete('inventory')->where('id', '=', $id)->run();
});