<?php

use Paperwork\Extended\Number,
	Paperwork\Extended\Form;

$app->post('/post/job', 'uac', function() use ($app){
	/* Methods */
	$number	= new Number;
	$form	= new Form;
	$client_name = isset($_POST['client_name']) ? $_POST['client_name'] : false;
	$name = isset($_POST['name']) ? $_POST['name'] : false;
	
	/* Construction */
	if($client_name != ''){
		if($name != ''){
			
			$job_number = $number->next('job');
			$job_status_n = $number->get('job_status');
			
			if(!$job_status_id = $app->sql->get('job_status')->select('id')->where('job_status_number', '=', $job_status_n)->one()){
				$app->flash('error', 'You need to make at least one Job Status in the <a href="'.$app->root.'/settings">settings</a> page before making a job');
				$app->redirect($app->root.'/jobs');
			}
			
			if(!$client = $app->sql->get('client')->where('name', '=', $client_name)->one()){
				$client_number = $number->next('client');
				$client_id = $app->sql->post('client')->with([
					'client_number'	=> $client_number,
					'name' => $client_name,
				])->run();
			}
			
			$client_id = isset($client_id) ? $client_id : $client['id'];
			
			// Build new job_cache array which contains the array and json
			$cache_id = $form->cache();
			
			$app->sql->post('job')->with([
				'job_number'	=> $job_number,
				'client_id'		=> $client_id,
				'job_status_id'	=> $job_status_id,
				'job_cache_id'	=> $cache_id,
				'name'			=> $name
			])->run();
			
			$app->event->log('created a new job, job_number: '.$job_number);
			
			$app->redirect($app->root.'/job/'.$job_number); // Redirect to the new job
			
			/*****************************/
		}else{
			$app->flash('error', 'Please enter a job name for '.$client_name);
			$app->redirect($app->root.'/jobs');
		}
	}else{
		$app->flash('error', 'Please select a client and write a job name');
		$app->redirect($app->root.'/jobs');
	}
});