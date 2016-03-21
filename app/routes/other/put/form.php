<?php

$app->post('/put/form', 'uac', function() use ($app){
	/* Methods */
	
	/* Construction */
	if(isset($_POST['formID']) && isset($_POST['html'])){
		$formID = $_POST['formID'];
		$html = trim($_POST['html']);
		$json = $_POST['json'];
		$app->sql->put('job_form')->where('formID', '=', $formID)->with([
			'html' => $html,
			'json' => $json,
		])->run();
		echo $formID;
	}else{
		echo '0';
	}
});