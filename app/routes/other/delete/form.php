<?php

$app->post('/delete/form', 'uac', function() use ($app){
	/* Methods */
	
	/* Construction */
	if(isset($_POST['formID'])){
		if($form = $app->sql->get('job_form')->where('formID', '=', $_POST['formID'])->run()){
			$app->sql->delete('job_form')->where('formID', '=', $_POST['formID'])->run();
		}
	}else{
		echo '0';
	}
});