<?php

$app->get('/inventory', 'uac', function() use ($app){
	/* Methods */
	
	/* Construction */
	$app->build->page('views/inventory.html', [
		'inv' => $app->sql->get('inv')->all()->by('invID DESC')->run(),
		'enableBulk' => false
	]);
});