<?php

$app->get('/get/document/:a', 'uac', function($a) use ($app){
	/* Methods */
	
	/* Construction */
	$document;
	
	if(!$documents = $app->sql->get('document')->where('job_id', '=', $a)->all()){
		die($app->build->error("No documents found for job_id: {$a}"));
	}
	
	foreach($documents as $key => $value){
		
		$document_id = $value['id'];
		$job_number = $value['job']['job_number'];
		$client_name = $value['client']['name'];
		$client_address = $value['client']['address'];
		
		unset(
			$value['id'],
			$value['user_id'],
			$value['user_template'],
			$value['client'],
			$value['job'],
			$value['html'],
			$value['date_created'],
			$value['date_touched'],
			$value['date_deleted']
		);
		
		$value['items'] = $app->parse->jsonToArray($value['items']);
		
		if(isset($value['items']['items'])){
			$value['items'] = $value['items']['items'];
		}
		
		$value['id'] = $job_number;
		$value['client-name'] = $client_name;
		$value['client-address'] = $client_address;
		
		$document[$document_id] = $value;
	}
	
	echo $app->parse->arrayToJson($document);
});