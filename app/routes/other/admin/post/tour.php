<?php

$app->post('/admin/post/tour', 'admin', function() use ($app){
	/* Methods */
	$user_id = isset($_POST['user_id']) ? $_POST['user_id'] : false;
	$page = isset($_POST['page']) ? $_POST['page'] : false;
	$text = isset($_POST['text']) ? $_POST['text'] : false;
	$anchor = isset($_POST['anchor']) ? $_POST['anchor'] : false;
	$position = isset($_POST['position']) ? $_POST['position'] : false;
	$commands = isset($_POST['commands']) ? $_POST['commands'] : false;
	
	/* Construction */
	$user_id = $app->parse->jsonToArray($user_id);
	
	$string = '';
	
	// All users
	if($user_id == '*'){
		$user_id = [];
		$users = $app->sql->get('user')->select(['id'])->root()->all();
		foreach($users as $key => $value){
			$user_id[$key] = $value['id'];
		}
	}
	
	// Command manipulation
	$commands = $app->parse->jsonToArray($commands);
	if(isset($commands['href'])){
		$href = $commands['href'];
		
		$href = trim($href);
		if($href) $commands['href'] = $app->root.$href;
	}
	
	$commands = $app->parse->arrayToJson($commands);
	
	// Iterate each tour
	foreach($user_id as $key => $value){
		$app->sql->post('tour')->with([
			'user_id' => $value,
			'page' => $page,
			'text' => $text,
			'anchor' => $anchor,
			'position' => $position,
			'commands' => $commands,
		])->root()->run();
	}
	
	echo 'success';
});