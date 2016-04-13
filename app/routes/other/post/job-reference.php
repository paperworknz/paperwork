<?php

$app->post('/post/job-reference', function() use ($app){
	/* Methods */
	
	/* Construction */
	$jobID = $_POST['job_reference'];
	
	$job = $app->sql->get('job')->by('jobID ASC')->soft()->run();
	
	if($job){
		if(isset($job[0])){
			$jobr = $job[0]['jobID'] + 1;
		}else{
			$jobr = $job['jobID'] + 1;
		}
	}else{
		$jobr = 0;
	}
	
	if($jobID < $jobr){
		$app->flash('error', 'New Job Reference number must be '.$jobr.' or higher');
		$app->redirect($app->root.'/settings');
	}else{
		$app->sql->put('master.uac')->where('uacID', '=', $app->user['uacID'])->with([
			'job_reference' => $jobID
		])->run();
	}
	
	$app->flash('success', 'Job Reference changed successfully');
	$app->redirect($app->root.'/settings');
});