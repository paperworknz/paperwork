<?php

$app->post('/put/rename-form', 'uac', function() use ($app){
	
	if(isset($_POST['formID'], $_POST['name'])){
		$formID = $_POST['formID'];
		$name = $_POST['name'];
		
		$app->sql->put('job_form')->with([
			'name' => $name,
		])->where('id', '=', $formID)->run();
		
		echo $app->build->success([
			'name' => $name
		]);
	}
});