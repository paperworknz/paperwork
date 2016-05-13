<?php

$app->post('/delete/inv', 'uac', function() use ($app){
	/* Methods */
	$id = isset($_POST['id']) ? $_POST['id'] : false;
	
	/* Construction */
	if($id){
		$app->sql->delete('inventory')->where('id', '=', $id)->run();
	}else{
		echo '0';
	}
});