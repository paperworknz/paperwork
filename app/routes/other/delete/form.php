<?php

$app->post('/delete/form', 'uac', function() use ($app){
	/* Methods */
	$id = isset($_POST['id']) ? $_POST['id'] : false;
	
	/* Construction */
	if($id){
		$app->sql->delete('job_form')->where('id', '=', $id)->run();
		$app->event->log('deleted a job_form, id: '.$id);
	}else{
		echo '0';
	}
});