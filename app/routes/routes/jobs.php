<?php

$app->get('/jobs', 'uac', function() use ($app){
	/* Methods */
	
	/* Construction */
	$jobs = $app->module->require('jobs');
	
	$app->build->page('views/jobs.html', [
		'modules' => [
			'jobs' => $jobs,
		],
		'cname' => (!isset($_GET['id']) ?: ($app->sql->get('client')->select(['name'])->where('client_number', '=', $_GET['id'])->one()))
	]);
});