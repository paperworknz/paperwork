<?php

$app->get('/jobs', 'uac', function() use ($app){
	/* Methods */
	
	/* Construction */
	$jobs = $app->sql->get('job')
		->select(['id', 'job_number', 'name', 'client_id', 'job_status_id'])
		->also('ORDER BY job_number DESC')
		->all();
	
	$clients = $app->sql->get('client')->select(['name'])->also('ORDER BY name ASC')->all();
	$status = $app->sql->get('job_status')->select(['name'])->also('ORDER BY job_status_number')->all();
	
	$app->build->page('views/jobs.html', [
		'clients'	=> $clients,
		'jobs'		=> $jobs,
		'status'	=> $status,
		'cname'		=> (!isset($_GET['id']) ?: ($app->sql->get('client')->select(['name'])->where('client_number', '=', $_GET['id'])->one()))
	]);
});