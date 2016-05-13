<?php

$app->post('/put/form-json', 'uac', function() use ($app){
	/* Methods */
	$id = isset($_POST['id']) ? $_POST['id'] : false;
	$json = isset($_POST['json']) ? $_POST['json'] : false;
	
	/* Construction */
	if($id){
		$app->sql->put('job_form')->where('id', '=', $id)->with([
			'json' => $json,
		])->run();
	}else{
		echo '0';
	}
});