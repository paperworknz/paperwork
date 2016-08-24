<?php

$app->post('/put/restore', 'uac', function() use ($app){
	
	/*
	
	Need to check if the client is deleted or not
	
	*/
	
	switch($_POST['type']){
		case 'job': $table = 'job'; break;
		case 'document': $table = 'document'; break;
		case 'client': $table = 'client'; break;
		case 'inventory': $table = 'inventory'; break;
		case 'template': $table = 'user_template'; break;
	}
	
	
	// Get table:ID
	if($item = $app->sql->get($table)->where('id', '=', $_POST['id'])->softOnly()->one()){
		// If request is a job or document
		if($table == 'job' || $table == 'document'){
			// Check if the client has been deleted
			if($client = $app->sql->get('client')->where('id', '=', $item['client']['id'])->softOnly()->one()){
				// If it has, restore client as well
				$app->sql->put('client')->where('id', '=', $item['client']['id'])->with([
					'date_deleted' => '0000-00-00 00:00:00'
				])->soft()->run();
			}
			if($table == 'document'){
				// Check if the job has been deleted
				if($job = $app->sql->get('job')->where('id', '=', $item['job']['id'])->softOnly()->one()){
					// If it has, restore job as well
					$app->sql->put('job')->where('id', '=', $item['job']['id'])->with([
						'date_deleted' => '0000-00-00 00:00:00'
					])->soft()->run();
				}
			}
		}
		
		// Undo soft delete
		$app->sql->put($table)->with([
			'date_deleted' => '0000-00-00 00:00:00'
		])->soft()->where('id', '=', $_POST['id'])->run();
		
		// Echo success
		echo $app->build->success([
			'name' => $_POST['type'].':'.$_POST['id'].' restored.'
		]);
	}
	
});