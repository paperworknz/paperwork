<?php

$app->get('/get/document/:a', 'uac', function($a) use ($app){
	/* Methods */
	
	/* Construction */
	$document;
	
	if(!$documents = $app->sql->get('document')->where('job_id', '=', $a)->all()){
		die($app->build->error("No documents found for job_id: {$a}"));
	}
	
	$document = $app->document->get($documents);
	
	echo $app->parse->arrayToJson($document);
});