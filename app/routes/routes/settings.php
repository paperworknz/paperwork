<?php

use Paperwork\Extended\Number;

$app->get('/settings', 'uac', function() use ($app){
	/* Methods */
	$number = new Number;

	/* Construction */
	
	// Status
	$status	= $app->sql->get('job_status')->all();
	
	// New job_number
	$job_number	= $number->next('job');
	
	// Trash
	$job	= $app->sql->get('job')->select(['id', 'job_number', 'name', 'client_id'])->softOnly()->all();
	$form	= $app->sql->get('job_form')->select(['id', 'job_id', 'name'])->softOnly()->all();
	$client	= $app->sql->get('client')->select(['id', 'client_number', 'name'])->softOnly()->all();
	$inventory = $app->sql->get('inventory')->select(['id', 'name', 'price'])->softOnly()->all();
	
	$app->build->page('views/settings.html', [
		'status'	=> $status,
		'jobs'		=> $job,
		'forms'		=> $form,
		'clients'	=> $client,
		'inventory'	=> $inventory,
		'job_number'=> $job_number,
	]);
});