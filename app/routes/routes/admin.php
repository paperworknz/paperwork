<?php

$app->get('/admin', 'admin', function() use ($app){
	/* Methods */

	/* Construction */
	$app->build->page('views/admin.html', [
		'switch' => $app->env
	]);
});