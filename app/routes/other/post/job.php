<?php

use Paperwork\Extended\Number,
	Paperwork\Extended\Document;

$app->post('/post/job', 'uac', function() use ($app){
	/* Methods */
	$number	= new Number;
	$document = new Document;
	$client_name = isset($_POST['client_name']) ? $_POST['client_name'] : false;
	$name = isset($_POST['name']) ? $_POST['name'] : false;
	$job_number = $number->next('job');
	$job_status_n = $number->get('job_status');
	$client_number = $number->next('client');
	$job_status_id = $app->sql->get('job_status')->select('id')->where('job_status_number', '=', $job_status_n)->one();
	$client = $app->sql->get('client')->where('name', '=', $client_name)->one();
	
	/* Construction */
	if(!$client_name){
		$app->flash('error', 'Please enter a job name for '.$client_name);
		$app->redirect($app->root.'/jobs');
	}
	
	if(!$name){
		$app->flash('error', 'Please select a client and write a job name');
		$app->redirect($app->root.'/jobs');
	}
	
	if(!$job_status_id){
		$app->flash('error', 'You need to make at least one Job Status in your settings before making a job');
		$app->redirect($app->root.'/jobs');
	}
	
	// Create a client if it does not exist
	if(!$client){
		$client_id = $app->sql->post('client')->with([
			'client_number'	=> $client_number,
			'name' => $client_name,
		])->run();
	}
	
	$client_id = isset($client_id) ? $client_id : $client['id'];
	
	$app->sql->post('job')->with([
		'job_number'	=> $job_number,
		'client_id'		=> $client_id,
		'job_status_id'	=> $job_status_id,
		'name'			=> $name,
	])->run();
	
	$app->redirect("{$app->root}/job/{$job_number}"); // Redirect to the new job
});