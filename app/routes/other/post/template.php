<?php

$app->post('/post/template', 'uac', function() use ($app){
	/* Methods */
	$name = isset($_POST['name']) ? $_POST['name'] : false;
	$theme = isset($_POST['theme']) ? $_POST['theme'] : false;
	
	/* Construction */
	if(!$name){
		die($app->build->error('Template name not provided'));
	}
	
	if(!$theme){
		die($app->build->error('Template theme not provided'));
	}
	
	// Get theme content
	if(!file_exists("../app/app/storage/templates/$theme.html")){
		die($app->build->error("Template theme $theme does not exist"));
	}
	
	$theme = file_get_contents("../app/app/storage/templates/$theme.html");
	
	$id = $app->sql->post('job_form_template')->with([
		'name' => $name,
		'content' => trim($theme),
	])->run();
	
	$template = $app->sql->get('job_form_template')
	->select(['id', 'name', 'content'])->where('id', '=', $id)->one();
	
	echo $app->parse->arrayToJson($template);
	
});