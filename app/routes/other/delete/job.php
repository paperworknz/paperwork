<?php

$app->post('/delete/job', 'uac', function() use ($app){
	/* Methods */
	$id = isset($_POST['id']) ? $_POST['id'] : false;
	
	/* Construction */
	if(!$id){
		die($app->build->error('Job ID not provided'));
	}
	
	$app->sql->delete('job_form')->where('job_id', '=', $id)->run();
	$app->sql->delete('job')->where('id', '=', $id)->run();
	
	$app->redirect($app->root.'/jobs');
});