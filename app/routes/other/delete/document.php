<?php

$app->post('/delete/document', 'uac', function() use ($app){
	/* Methods */
	$id = isset($_POST['id']) ? $_POST['id'] : false;
	
	/* Construction */
	if(!$id){
		die($app->build->error('Document ID not provided'));
	}
	
	$app->sql->delete('document')->where('id', '=', $id)->run();
});