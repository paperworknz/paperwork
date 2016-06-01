<?php

$app->get('/jobs', 'uac', function() use ($app){
	/* Methods */
	
	/* Construction */
	$status = $app->sql->get('job_status')->select(['id', 'name'])->also('ORDER BY job_status_number')->all();
	$completed = 0;
	
	foreach($status as $index => $item){
		if($item['name'] == 'Completed'){
			$completed = $item['id'];
			unset($status[$index]);
			break;
		}
	}
	
	$jobs = $app->sql->get('job')
		->select(['id', 'job_number', 'name', 'client_id', 'job_status_id'])
		->where('job_status_id', '<>', $completed)
		->also('ORDER BY job_number DESC')
		->all();
	
	$clients = $app->sql->get('client')->select(['name'])->also('ORDER BY name ASC')->all();
	
	
	$app->build->page('views/jobs.html', [
		'clients'	=> $clients,
		'jobs'		=> $jobs,
		'status'	=> $status,
		'cname'		=> (!isset($_GET['id']) ?: ($app->sql->get('client')->select(['name'])->where('client_number', '=', $_GET['id'])->one()))
	]);
});