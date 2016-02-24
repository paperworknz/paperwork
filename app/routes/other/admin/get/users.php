<?php

$app->post('/admin/get/users', function() use ($app){
	/* Methods */
	
	/* Construction */
	$users = $app->sql->get('master.uac')->all()->run();
	echo $app->parse->arrayToJson($users);
});