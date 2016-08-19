<?php

$app->post('/post/document', 'uac', function() use ($app){
	/* Methods */
	$job_id = isset($_POST['job_id']) ? $_POST['job_id'] : false;
	$template_id = isset($_POST['template_id']) ? $_POST['template_id'] : false;
	$document = isset($_POST['document']) ? $_POST['document'] : false;
	
	/* Construction */
	if(!$job_id) die($app->build->error('Job ID not provided'));
	if(!$template_id) die($app->build->error('Template ID not provided'));
	
	// Data
	$job = $app->sql->get('job')->where('id', '=', $job_id)->one();
	$client = $app->sql->get('client')->where('id', '=', $job['client']['id'])->one();
	$user_template = $app->sql->get('user_template')->retain(['template_id'])->where('id', '=', $template_id)->one();
	$template = $app->sql->get('template')->where('id', '=', $user_template['template_id'])->root()->one();
	$email = $app->sql->get('user_email_settings')->one();
	
	$data = [
		'job_id' => $job_id,
		'client_id' => $client['id'],
		'user_template_id' => $template_id,
		'name' => $user_template['name'], // Inherit from user_template
		'date' => $document['date'] ?: date("d/m/Y"),
		'description' => $document['description'] ?: '',
		'items' => $app->parse->arrayToJson($document['items']) ?: '[]',
	];
	
	// Post new Document
	$id = $app->sql->post('document')->with($data)->run();
	
	// Get new Document
	$documents = $app->sql->get('document')->where('id', '=', $id)->all();
	
	// Format document data
	$document = $app->document->get($documents);
	
	// Twig render document.html
	$html = $app->build->page('other/html/document.html', [
		'document' => [
			'id' => $id,
			'user_template' => [
				'template' => $template,
			]
		]
	], false);
	
	$response = [
		'name' => $user_template['name'],
		'body' => $html,
		'document' => $document,
	];
	
	echo $app->parse->arrayToJson($response);
});