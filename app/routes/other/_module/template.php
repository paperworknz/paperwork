<?php

$app->module->add('template', 'user', function($request) use ($app){
	
	$prop = [];
	$template = [];
	$templates = [];
	$template_id = [];
	
	// TEMPLATES //
	$user_templates = $app->sql->get('user_template')->retain(['template_id'])->all();
	
	if($user_templates){
		foreach($user_templates as $data) array_push($template_id, $data['template_id']);
		
		$templates = $app->sql->get('template')->where('id', 'IN', $template_id)->root()->all();
		
		foreach($user_templates as $data){
			foreach($templates as $value){
				if($value['id'] != $data['template_id']) continue;
				
				array_push($template, [
					'id' => $data['id'],
					'name' => $data['name'],
					'body' => $value['body'],
				]);
				
				break;
			}
		}
	}
	
	// Properties
	$properties = $app->sql->get('user_template_properties')->one();
	
	unset(
		$properties['id'],
		$properties['user_id'],
		$properties['date_created'],
		$properties['date_touched'],
		$properties['date_deleted']
	);
	
	return [
		'behaviors' => ['tab'],
		'data' => [
			'templates' => $template,
			'properties' => $properties,
		],
	];
});