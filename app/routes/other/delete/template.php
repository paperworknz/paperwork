<?php

$app->post('/delete/template', 'uac', function() use ($app){
	/* Methods */
	$id = isset($_POST['id']) ? $_POST['id'] : false;
	$new_id;
	
	/* Construction */
	if(!$id){
		die($app->build->error('Template id not provided'));
	}
	
	// Retrieve all templates
	$templates = $app->sql->get('user_template')->retain(['template_id'])->all();
	
	// Die if this is the user's last template
	if(count($templates) <= 1){
		die($app->build->error("You can't delete your last template!"));
	}
	
	// Get next best template
	foreach($templates as $template){
		if($template['id'] != $id) $new_id = $template['id'];
	}
	
	if(!$new_id){
		die($app->build->error("Sorry, you can't delete this template"));
	}
	
	// Update all documents that use the soon-to-be-deleted template
	$app->sql->put('document')->with([
		'user_template_id' => $new_id,
	])->where('user_template_id', '=', $id)->run();
	
	// Delete template
	$app->sql->delete('user_template')->where('id', '=', $id)->hard()->run();
	
	echo $app->build->success([
		'message' => 'Template deleted successfully',
	]);
});