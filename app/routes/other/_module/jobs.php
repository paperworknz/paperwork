<?php

$app->module->add('jobs', function($request) use ($app){
	
	$completed = 0;
	$status = $app->sql->get('job_status')->select(['id', 'name'])->also('ORDER BY job_status_number')->all();
	
	foreach($status as $index => $item){
		if($item['name'] == 'Completed'){
			$completed = $item['id'];
			break;
		}
	}
	
	$jobs = $app->sql->get('job')
		->select(['id', 'job_number', 'name', 'client_id', 'job_status_id'])
		->where('job_status_id', '<>', $completed)
		->also('ORDER BY job_number DESC')
		->all();
	
	$clients = $app->sql->get('client')->select(['name'])->also('ORDER BY name ASC')->all();
	
	return [
		'third' => ['typeahead', 'contextmenu', 'interact', 'sortable', 'tinysort'],
		'classes' => ['Table', 'Typeahead'],
		'data' => [
			'clients' => $clients,
			'jobs' => $jobs,
			'status' => $status,
		],
	];
});