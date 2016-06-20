<?php

$app->post('/get/notification', 'uac', function() use ($app){
	/* Methods */
	$page = isset($_POST['page']) ? $_POST['page'] : false;
	
	/* Construction */
	if($page){
		
		// Replace numeric shards with *
		$page = explode('/', $page);
		
		foreach($page as $key => $value){
			if(ctype_digit($value)) $page[$key] = '%'; 
		}
		
		$page = implode('/', $page);
		
		$notifications = $app->sql->get('notification')->select(['id', 'text', 'anchor', 'position', 'commands'])
		->where('page', 'LIKE', $page)->all();
		
		foreach($notifications as $key => $notification){
			$notifications[$key] = str_replace(PHP_EOL, '<br>', $notification);
		}
		
		if($notifications) echo $app->parse->arrayToJson($notifications);
	}
});