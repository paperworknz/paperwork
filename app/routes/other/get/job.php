<?php

$app->get('/get/job/:a', 'uac', function($a) use ($app){
	/* Methods */
	
	/* Construction */
	$job = $app->sql->get('job')->where('job_number', '=', $a)->select(['id'])->one();
	
	if(!$job){
		die($app->build->error("Job {$a} does not exist"));
	}
	
	echo $app->build->success([
		'job_id' => $job,
	]);
});