<?php

use Paperwork\Extended\Number;

$app->post('/post/job-n', 'uac', function() use ($app){
	/* Methods */
	$number = new Number;
	$job_number = isset($_POST['job_number']) ? $_POST['job_number'] : false;
	
	/* Construction */
	
	if($job_number){
		$id = $app->sql->get('job')->select('job_number')->also("ORDER BY job_number DESC LIMIT 1")->soft()->one();
		$next = $number->next('job');
		
		if($id){
			$id = $id + 1;
		}else{
			$id = 1;
		}
		
		if($job_number < $id){
			$app->flash('error', 'New job number must be '.$id.' or higher');
			$app->redirect($app->root.'/settings');
		}else{
			$app->sql->put('user_number')->with([
				'job_number' => $job_number
			])->run();
		}
		
		$app->flash('success', 'Job number changed successfully');
		$app->redirect($app->root.'/settings');
	}else{
		$app->flash('error', 'Please enter a number');
		$app->redirect($app->root.'/settings');
	}
});