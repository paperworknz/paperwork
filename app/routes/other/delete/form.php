<?php

$app->post('/delete/form', 'uac', function() use ($app){
	/* Methods */
	$id = isset($_POST['id']) ? $_POST['id'] : false;
	
	/* Construction */
	if($id){
		$app->sql->delete('job_form')->where('id', '=', $id)->run();
	}else{
		echo '0';
	}
});