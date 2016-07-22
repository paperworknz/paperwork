<?php

$app->post('/delete/template', 'uac', function() use ($app){
	/* Methods */
	$id = isset($_POST['id']) ? $_POST['id'] : false;
	
	/* Construction */
	if(!$id){
		die($app->build->error('Template id not provided'));
	}
	
	$app->sql->delete('job_form_template')->where('id', '=', $id)->run();
	
});