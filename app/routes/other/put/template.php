<?php

$app->post('/put/template', 'uac', function() use ($app){
	/* Methods */
	$id = isset($_POST['id']) ? $_POST['id'] : false;
	$name = isset($_POST['name']) ? $_POST['name'] : false;
	$content = isset($_POST['content']) ? $_POST['content'] : false;
	
	/* Construction */
	if(!$id){
		die($app->build->error('Template id not provided'));
	}
	
	if(!$content){
		die($app->build->error('Template content not provided'));
	}
	
	if(!$name){
		die($app->build->error('Template name not provided'));
	}
	
	$id = $app->sql->put('job_form_template')->with([
		'name' => $name,
		'content' => trim($content),
	])->where('id', '=', $id)->run();
	
	$template = $app->sql->get('job_form_template')
	->select(['id', 'name', 'content'])->where('id', '=', $id)->one();
	
	echo $app->parse->arrayToJson($template);
	
});