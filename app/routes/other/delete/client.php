<?php

$app->post('/delete/client', 'uac', function() use ($app){
	/* Methods */
	$id = isset($_POST['id']) ? $_POST['id'] : false;
	
	/* Construction */
	if($id){
		$app->sql->delete('job_form')->where('client_id', '=', $id)->run();
		$app->sql->delete('job')->where('client_id', '=', $id)->run();
		$app->sql->delete('client')->where('id', '=', $id)->run();
	}
	
	$app->event->log('deleted client: '.$id);
	
	$app->redirect($app->root.'/clients');
});