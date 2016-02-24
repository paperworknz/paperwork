<?php

$app->get('/settings', 'uac', function() use ($app){
	/* Methods */

	/* Construction */
	$my		= $app->sql->get('settings')->run();
	$status	= $app->sql->get('job_status')->all()->run();
	unset($status[0]); // Remove the in-built completed status
	
	$app->build->page('views/settings.html', [
		'my'		=> $my,
		'status'	=> $status,
		'enableEmail' => false,
	]);
});