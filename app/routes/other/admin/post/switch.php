<?php

$app->post('/admin/post/switch', function() use ($app){
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
	
	$app->sql->put('master.switch')->where('name', '=', $name)->with([
		'value' => $value
	])->run();
	
	echo 'Success';
});