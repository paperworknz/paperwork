<?php

$app->post('/put/form', 'uac', function() use ($app){
	/* Methods */
	
	/* Construction */
	if(isset($_POST['formID']) && isset($_POST['blob'])){
		$formID = $_POST['formID'];
		$blob = trim($_POST['blob']);
		$app->sql->put('job_form')->where('formID', '=', $formID)->with([
			'content' => $blob
		])->run();
	}else{
		echo '0';
	}
});