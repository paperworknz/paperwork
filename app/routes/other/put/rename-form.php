<?php

$app->post('/put/rename-form', 'uac', function() use ($app){
	/* Methods */
	$id = isset($_POST['id']) ? $_POST['id'] : false;
	$name = isset($_POST['name']) ? $_POST['name'] : false;
	
	/* Construction */
	if($id && $name){
		$app->sql->put('job_form')->with([
			'name' => $name,
		])->where('id', '=', $id)->run();
		
		echo $app->build->success([
			'name' => $name
		]);
	}
});