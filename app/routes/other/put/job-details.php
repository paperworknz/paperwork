<?php

use Paperwork\Extended\ID;

$app->post('/put/job-details', 'uac', function() use ($app){
	$ID = new ID;
	
	/* Contract */
	/*
		GET
		jobID: int
		status: int
		
		RETURN
		
	*/
	
	if(isset($_POST['notes']) && isset($_POST['jobID'])){
		$notes = $_POST['notes'];
		$app->sql->put('job')->with(['notes' => $notes])->where('jobID', '=', $_POST['jobID'])->run();
	}
	if(isset($_POST['name']) && isset($_POST['jobID'])){
		$name = filter_var($_POST['name'], FILTER_SANITIZE_STRING);
		$app->sql->put('job')->with(['name' => $name])->where('jobID', '=', $_POST['jobID'])->run();
	}
	if(isset($_POST['status']) && isset($_POST['jobID'])){
		$status = $ID->translateID('statusID', $_POST['status']);
		if($_POST['status'] == 'Completed'){
			$app->sql->put('job')->with([
				'statusID' => $status,
				'date_completed' => date("Y-m-d H:i:s")
			])->where('jobID', '=', $_POST['jobID'])->run();
		}else if($_POST['status'] == 'Invoiced Out'){
			$app->sql->put('job')->with([
				'statusID' => $status,
				'date_invoiced' => date("Y-m-d H:i:s")
			])->where('jobID', '=', $_POST['jobID'])->run();
		}else{
			$app->sql->put('job')->with(['statusID' => $status])->where('jobID', '=', $_POST['jobID'])->run();
		}
		echo $_POST['status'];
	}
});