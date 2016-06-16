<?php

$app->post('/get/notification', 'uac', function() use ($app){
	/* Methods */
	$page = isset($_POST['page']) ? $_POST['page'] : false;
	
	/* Construction */
	if($page){
		$notifications = $app->sql->get('notification')->select(['id', 'text', 'anchor', 'position'])
		->where('page', '=', $page)->all();
		
		foreach($notifications as $key => $notification){
			$notifications[$key] = str_replace(PHP_EOL, '<br>', $notification);
		}
		
		if($notifications) echo $app->parse->arrayToJson($notifications);
	}
});