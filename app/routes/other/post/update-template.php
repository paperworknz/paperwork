<?php

$app->post('/post/update-template', 'uac', function() use ($app){
	/* Methods */
	$id = isset($_POST['id']) ? $_POST['id'] : false;
	$direction = isset($_POST['direction']) ? $_POST['direction'] : false;
	
	/* Construction */
	if(!$id){
		die($app->build->error('Template ID not provided'));
	}
	
	if(!$direction){
		die($app->build->error('Template direction not provided'));
	}
	
	$template_id = $app->sql->get('user_template')->select(['template_id'])->retain(['template_id'])->where('id', '=', $id)->one();
	
	$whitelist = [0, 1, 2];
	
	if($app->user['privilege'] == 'admin') unset($whitelist[1], $whitelist[2]);
	if($app->user['id'] == 3) unset($whitelist[1]);
	if($app->user['id'] == 4) unset($whitelist[2]);
	
	if($direction == 'previous'){
		
		$template = $app->sql->get('template')->where('id', '<', $template_id)->and('id', 'NOT IN', $whitelist)->also('LIMIT 1')->root()->one();
		
		// Reached the start
		if(!$template) $template = $app->sql->get('template')->where('id', 'NOT IN', $whitelist)->also('ORDER BY id DESC LIMIT 1')->root()->one();
	}
	
	if($direction == 'next'){
		
		$template = $app->sql->get('template')->where('id', '>', $template_id)->and('id', 'NOT IN', $whitelist)->also('LIMIT 1')->root()->one();
		
		// Reached the end
		if(!$template) $template = $app->sql->get('template')->where('id', 'NOT IN', $whitelist)->also('ORDER BY id LIMIT 1')->root()->one();
	}
	
	// Update template_id
	$app->sql->put('user_template')->with([
		'template_id' => $template['id'],
	])->where('id', '=', $id)->run();
	
	echo $app->build->success([
		'id' => $template['id'],
		'body' => $template['body'],
	]);
});