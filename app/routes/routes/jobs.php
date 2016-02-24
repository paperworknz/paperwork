<?php

use Paperwork\Extended\ID;

$app->get('/jobs', 'uac', function() use ($app){
	/* Methods */
	$ID = new ID;
	
	/* Construction */
	$jobs = $app->sql->get('job')->by('date_created DESC')->all()->run();
	
	$app->build->page('views/jobs.html', [
		'jobID'		=> $ID->newJobID(),
		'client'	=> $app->sql->get('client')->by('name ASC')->all()->run(),
		'job'		=> $jobs,
		'status'	=> $app->sql->get('job_status')->all()->run(),
		'cname'		=> (!isset($_GET['id']) ?: ($app->sql->get('client')->where('clientID', '=', $_GET['id'])->run()['name']))
	]);
});