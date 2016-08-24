<?php

$app->post('/put/job', 'uac', function() use ($app){
	/* Methods */
	
	/* Construction */
	if(isset($_POST['notes']) && isset($_POST['id'])){
		$notes = $_POST['notes'];
		$app->sql->put('job')->with([
			'notes' => $notes
		])->where('id', '=', $_POST['id'])->run();
	}
	if(isset($_POST['name']) && isset($_POST['id'])){
		$name = filter_var($_POST['name'], FILTER_SANITIZE_STRING);
		$app->sql->put('job')->with([
			'name' => $name
		])->where('id', '=', $_POST['id'])->run();
	}
	if(isset($_POST['status']) && isset($_POST['id'])){
		
		$status = $app->sql->get('job_status')->where('name', '=', $_POST['status'])->one();
		
		if($_POST['status'] == 'Completed'){
			
			$app->sql->put('job')->with([
				'job_status_id' => $status['id'],
				'date_completed' => date("Y-m-d H:i:s")
			])->where('id', '=', $_POST['id'])->run();
			
		}elseif($_POST['status'] == 'Invoiced Out'){
			$app->sql->put('job')->with([
				'job_status_id' => $status['id'],
				'date_invoiced' => date("Y-m-d H:i:s")
			])->where('id', '=', $_POST['id'])->run();
		}else{
			$app->sql->put('job')->with([
				'job_status_id' => $status['id']
			])->where('id', '=', $_POST['id'])->run();
		}
		echo $_POST['status'];
		
	}
});