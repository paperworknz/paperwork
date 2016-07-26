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
	if(!file_exists("../app/app/storage/templates/$theme")){
		die($app->build->error("Template theme $theme does not exist"));
	}
	
	$theme = file_get_contents("../app/app/storage/templates/$theme");
	
	// Remove redundent inline css
	$theme = str_replace('-moz-box-sizing: border-box;', '', $theme);
	$theme = str_replace('-webkit-box-sizing: border-box;', '', $theme);
	$theme = str_replace('box-sizing: border-box;', '', $theme);
	$theme = str_replace('border-spacing: 0;', '', $theme);
	$theme = str_replace('border-collapse: collapse;', '', $theme);
	$theme = str_replace('list-style-type: none;', '', $theme);
	
	// Tidy up spaces
	$theme = preg_replace('/\s+/', ' ', $theme); // Turn 2+ spaces into 1 space
	$theme = str_replace('style=" "', '', $theme);
	$theme = str_replace('style=" ', 'style="', $theme);
	
	$id = $app->sql->post('job_form_template')->with([
		'name' => $name,
		'content' => trim($theme),
	])->run();
	
	$template = $app->sql->get('job_form_template')
	->select(['id', 'name', 'content'])->where('id', '=', $id)->one();
	
	echo $app->parse->arrayToJson($template);
	
});