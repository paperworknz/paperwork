<?php

$app->post('/admin/post/maintenance', function() use ($app){
	/* Methods */
	
	/* Construction */
	$pw = $_POST['password'];
	$admin = $app->sql->get('master.uac')->where('username', '=', 'admin')->run();
	
	if(password_verify($pw, $admin['password'])){
		
		// Toggle maintenance
		if(!$app->env['maintenance']){
			$value = 1;
		}else{
			$value = 0;
		}
		
		// Update maintenance
		$app->sql->put('master.switch')->with([
			'value' => $value
		])->where('name', '=', 'maintenance')->run();
		
		echo $value;
		
	}
});