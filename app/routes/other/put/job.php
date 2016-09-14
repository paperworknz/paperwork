<?php

$app->post('/put/job', 'uac', function() use ($app){
	/* Methods */
	
	$data = [];
	$request = [
		'id' => isset($_POST['id']) ? $_POST['id'] : false,
		'name' => isset($_POST['name']) ? $_POST['name'] : false,
		'notes' => isset($_POST['notes']) ? $_POST['notes'] : false,
		'status' => isset($_POST['status']) ? $_POST['status'] : false,
	];
	
	foreach($request as $key => $value) if($value) $data[$key] = $value;
	
	/* Construction */
	if(!$data['id']){
		die($app->build->error('No job id provided'));
	}
	
	$app->sql->put('job')->with($data)->where('id', '=', $data['id'])->run();
	
	if(isset($data['status'])){
		
		$status = $app->sql->get('job_status')->where('name', '=', $data['status'])->one();
		
		if($data['status'] == 'Completed'){
			
			$app->sql->put('job')->with([
				'job_status_id' => $status['id'],
				'date_completed' => date("Y-m-d H:i:s")
			])->where('id', '=', $data['id'])->run();
			
		}elseif($data['status'] == 'Invoiced Out'){
			$app->sql->put('job')->with([
				'job_status_id' => $status['id'],
				'date_invoiced' => date("Y-m-d H:i:s")
			])->where('id', '=', $data['id'])->run();
		}else{
			$app->sql->put('job')->with([
				'job_status_id' => $status['id']
			])->where('id', '=', $data['id'])->run();
		}
		
		echo $data['status'];
	}
});