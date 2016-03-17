<?php

$app->post('/put/restore', 'uac', function() use ($app){
	
	/*
	
	Need to check if the client is deleted or not
	
	*/
	
	switch($_POST['type']){
		case 'jobID': $table = 'job'; break;
		case 'formID': $table = 'job_form'; break;
		case 'clientID': $table = 'client'; break;
		case 'invID': $table = 'inv'; break;
	}
	
	
	// Get table:ID
	if($item = $app->sql->get($table)->where($_POST['type'], '=', $_POST['id'])->softOnly()->run()){
		// If request is a job or job_form
		if($table == 'job' || $table == 'job_form'){
			// Check if the client has been deleted
			if($client = $app->sql->get('client')->where('clientID', '=', $item['client']['clientID'])->softOnly()->run()){
				// If it has, restore client as well
				$app->sql->put('client')->where('clientID', '=', $item['client']['clientID'])->with([
					'date_deleted' => '0000-00-00 00:00:00'
				])->run();
			}
			if($table == 'job_form'){
				// Check if the job has been deleted
				if($job = $app->sql->get('job')->where('jobID', '=', $item['job']['jobID'])->softOnly()->run()){
					// If it has, restore job as well
					$app->sql->put('job')->where('jobID', '=', $item['job']['jobID'])->with([
						'date_deleted' => '0000-00-00 00:00:00'
					])->run();
				}
			}
		}
		
		// Undo soft delete
		$app->sql->put($table)->with([
			'date_deleted' => '0000-00-00 00:00:00'
		])->where($_POST['type'], '=', $_POST['id'])->run();
		
		// Echo success
		echo $app->build->success([
			'name' => $_POST['type'].':'.$_POST['id'].' restored.'
		]);
	}
	
});