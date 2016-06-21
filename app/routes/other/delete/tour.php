<?php

$app->post('/delete/tour', 'uac', function() use ($app){
	/* Methods */
	$id = isset($_POST['id']) ? $_POST['id'] : false;
	
	/* Construction */
	if($id) $app->sql->delete('tour')->where('id', '=', $id)->run();
});