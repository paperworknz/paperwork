<?php

$app->get('/get/form/:a', 'uac', function($a) use ($app){
	/* Methods */
	
	/* Construction */
	$raw = $app->sql->get('job_form')->where('jobID', '=', $a)->all()->run();
	$obj = [];
	foreach($raw as $case){
		$json = $app->parse->jsonToArray($case['json']);
		$obj[$case['formID']] = $json;
	}
	
	echo $app->parse->arrayToJson($obj);
});