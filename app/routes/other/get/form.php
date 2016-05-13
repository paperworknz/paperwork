<?php

$app->get('/get/form/:a', 'uac', function($a) use ($app){
	/* Methods */
	
	/* Construction */
	$data = [];
	if($forms = $app->sql->get('job_form')->where('job_id', '=', $a)->all()){
		foreach($forms as $form){
			$json = $app->parse->jsonToArray($form['json']);
			$data[$form['id']] = $json;
		}
	}
	
	echo $app->parse->arrayToJson($data);
});