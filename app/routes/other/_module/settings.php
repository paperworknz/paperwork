<?php

use Paperwork\Extended\Number;

$app->module->add('settings', 'user', function($request) use ($app){
	
	$number = new Number;
	$job_number	= $number->next('job');
	$status	= $app->sql->get('job_status')->also('ORDER BY job_status_number')->all();
	$email = $app->sql->get('user_email')->one();
	$timezone = include '../app/app/resources/timezone.php';
	$currency = include '../app/app/resources/currency.php';
	
	// Trash
	$job	= $app->sql->get('job')->select(['id', 'job_number', 'name', 'client_id'])->softOnly()->all();
	$document	= $app->sql->get('document')->select(['id', 'job_id', 'name'])->softOnly()->all();
	$client	= $app->sql->get('client')->select(['id', 'client_number', 'name'])->softOnly()->all();
	$inventory = $app->sql->get('inventory')->select(['id', 'name', 'price'])->softOnly()->all();
	$templates = $app->sql->get('user_template')->select(['id', 'name'])->softOnly()->all();
	
	return [
		'third' => ['sortable'],
		'behaviors' => ['tab'],
		'data' => [
			'status'	=> $status,
			'jobs'		=> $job,
			'documents'	=> $document,
			'clients'	=> $client,
			'inventory'	=> $inventory,
			'templates'	=> $templates,
			'job_number'=> $job_number,
			'email'		=> $email,
			'timezone'	=> $timezone,
			'currency'	=> $currency,
		],
	];
});