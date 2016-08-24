<?php

$app->module->add('client', 'user', function($request) use ($app){
	
	if(!$request) die($app->build->error('Client number not provided'));
	
	$client_id = $request[0];
	
	if(!$client = $app->sql->get('client')->where('client_number', '=', $client_id)->one()){
		$app->flash('error', 'We looked everywhere but we couldn\'t find the client you were looking for.');
		$app->redirect($app->root.'/clients');
	}
	
	$jobs = $app->sql->get('job')
		->select(['id', 'job_number', 'name', 'client_id', 'job_status_id'])
		->where('client_id', '=', $client['id'])
		->also('ORDER BY job_number DESC')
		->all();
	
	$status = $app->sql->get('job_status')->select(['name'])->also('ORDER BY job_status_number')->all();
	
	return [
		'third' => ['typeahead', 'contextmenu', 'interact', 'sortable', 'tinysort'],
		'classes' => ['Table', 'Typeahead'],
		'behaviors' => ['tab'],
		'data' => [
			'client' => $client,
			'jobs' => $jobs,
			'status' => $status,
		],
	];
});