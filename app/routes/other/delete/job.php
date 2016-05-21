<?php

$app->post('/delete/job', 'uac', function() use ($app){
	/* Methods */
	$id = isset($_POST['id']) ? $_POST['id'] : false;
	
	/* Construction */
	if($id){
		$app->sql->delete('job_form')->where('job_id', '=', $id)->run();
		$app->sql->delete('job')->where('id', '=', $id)->run();
	}
	
	$app->event->log('deleted a job, id: '.$id);
	
	$app->redirect($app->root.'/jobs');
});