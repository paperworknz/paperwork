<?php

$app->post('/admin/post/config', 'admin', function() use ($app){
	/* Methods */
	
	/* Construction */
	$name = filter_var($_POST['name'], FILTER_SANITIZE_STRING);
	if(isset($app->env[$name])){
		$value = $app->env[$name];
		if($value){
			$value = 0;
		}else{
			$value = 1;
		}
	}
	
	$app->sql->put('config')->where('name', '=', $name)->with([
		'value' => $value
	])->root()->run();
	
	echo 'Success';
});