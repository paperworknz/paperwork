<?php

$app->post('/put/form-json', 'uac', function() use ($app){
	/* Methods */
	
	/* Construction */
	if(isset($_POST['formID'])){
		$formID = $_POST['formID'];
		$json = $_POST['json'];
		$app->sql->put('job_form')->where('formID', '=', $formID)->with([
			'json' => $json,
		])->run();
	}else{
		echo '0';
	}
});