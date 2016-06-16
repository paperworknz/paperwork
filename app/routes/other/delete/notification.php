<?php

$app->post('/delete/notification', 'uac', function() use ($app){
	/* Methods */
	$id = isset($_POST['id']) ? $_POST['id'] : false;
	
	/* Construction */
	if($id) $app->sql->delete('notification')->where('id', '=', $id)->run();
});