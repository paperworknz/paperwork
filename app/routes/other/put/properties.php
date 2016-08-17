<?php

$app->post('/put/properties', 'uac', function() use ($app){
	/* Methods */
	$prop = [];
	$properties = isset($_POST['properties']) ? $_POST['properties'] : false;
	
	/* Construction */
	if(!$properties){
		die($app->build->success(['message' => 'No properties provided']));
	}
	
	unset(
		$properties['user-name'],
		$properties['user-company'],
		$properties['user-email'],
		$properties['user-address'],
		$properties['user-phone']
	);
	
	$app->sql->put('user_template_properties')->with($properties)->run();
	
	echo $app->build->success([
		'message' => 'Properties updated',
	]);
});