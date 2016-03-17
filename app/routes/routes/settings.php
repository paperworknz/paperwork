<?php

$app->get('/settings', 'uac', function() use ($app){
	/* Methods */

	/* Construction */
	$my		= $app->sql->get('settings')->run();
	$status	= $app->sql->get('job_status')->all()->run();
	unset($status[0]); // Remove the in-built completed status
	$job	= $app->sql->get('job')->softOnly()->all()->run();
	$form	= $app->sql->get('job_form')->softOnly()->all()->run();
	$client	= $app->sql->get('client')->softOnly()->all()->run();
	$inv	= $app->sql->get('inv')->softOnly()->all()->run();
	
	$app->build->page('views/settings.html', [
		'my'		=> $my,
		'status'	=> $status,
		'jobs'		=> $job,
		'forms'		=> $form,
		'clients'	=> $client,
		'inv'		=> $inv,
		'enableEmail' => false,
	]);
});