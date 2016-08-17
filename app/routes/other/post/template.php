<?php

$app->post('/post/template', 'uac', function() use ($app){
	/* Methods */
	$name = isset($_POST['name']) ? $_POST['name'] : false;
	
	/* Construction */
	if(!$name){
		die($app->build->error('Template name not provided'));
	}
	
	$id = $app->sql->post('user_template')->with([
		'name' => $name,
		'template_id' => 1,
	])->run();
	
	$template = $app->sql->get('template')->where('id', '=', 1)->root()->one();
	
	echo $app->parse->arrayToJson([
		'id' => $id,
		'name' => $name,
		'body' => $template['body'],
	]);
	
});