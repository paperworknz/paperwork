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
	$email = $app->sql->get('user_email')->one();
	$reference = $job['job_number'];
	
	// Increment reference number for Invoices
	if(strpos(strtolower($user_template['name']), 'invoice') !== false){
		
		$prev_reference = $app->sql->get('document')->select(['reference'])->where('job_id', '=', $job_id)->and('name', 'LIKE', '%invoice%')->also("ORDER BY id DESC LIMIT 1")->one();
		
		if(!empty($prev_reference)){
			
			// Increment decimal
			if(strpos($prev_reference, '.') !== false){
				list($int, $dec) = explode('.', $prev_reference);
				
				if(ctype_digit($dec)) $dec = $dec + 1;
				$reference = $int.'.'.$dec;
			}else{
				$reference = $job['job_number'].'.1';
			}
		}
	}
	
	$data = [
		'job_id' => $job_id,
		'client_id' => $client['id'],
		'user_template_id' => $template_id,
		'name' => $user_template['name'], // Inherit from user_template
		'date' => isset($document['date']) ? $document['date'] : date("d/m/Y"),
		'reference' => $reference, // Inherit from job
		'description' => isset($document['description']) ? $document['description'] : '',
		'items' => isset($document['items']) ? $app->parse->arrayToJson($document['items']) : '[]',
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