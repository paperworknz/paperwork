<?php

$app->post('/admin/get/activity', 'admin', function() use ($app){
	/* Methods */
	
	/* Construction */
	$user_id = $_POST['user_id'];
	$events = $app->sql->get('event')->where('user_id', '=', $user_id)->also('LIMIT 100')->root()->all();
	
	$events = array_reverse($events);
	
	if($events){
		echo $app->parse->arrayToJson($events);
	}else{
		echo "{}";
	}
	
});