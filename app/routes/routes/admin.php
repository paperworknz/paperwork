<?php

$app->get('/admin', 'admin', function() use ($app){
	/* Methods */

	/* Construction */
	$app->build->page('views/admin.html', [
		'user_registration'	=> $app->env['user_registration'],
	]);
});