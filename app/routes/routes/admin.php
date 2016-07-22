<?php

$app->get('/admin', 'uac', 'admin', function() use ($app){
	/* Methods */

	/* Construction */
	$admin = $app->module->require('admin');
	
	$app->build->page('views/admin.html', [
		'modules' => [
			'admin' => $admin,
		],
	]);
});