<?php

$app->get('/jobs', 'uac', function() use ($app){
	/* Methods */
	
	/* Construction */
	$jobs = $app->module->require('jobs');
	$name = false;
	
	if(isset($_GET['id'])){
		$name = $app->sql->get('client')->select(['name'])->where('client_number', '=', $_GET['id'])->one();
	}
	
	$app->build->page('views/jobs.html', [
		'modules' => [
			'jobs' => $jobs,
		],
		'name' => $name,
	]);
});