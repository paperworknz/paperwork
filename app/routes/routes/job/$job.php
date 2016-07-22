<?php

$app->get('/job/:a', 'uac', function($request) use ($app){
	/* Methods */
	
	/* Construction */
	$job = $app->module->require('job', [$request]);
	
	$app->build->page('views/job/$job.html', [
		'modules' => [
			'job' => $job,
		],
	]);
});