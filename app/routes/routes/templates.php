<?php

$app->get('/templates', 'uac', function() use ($app){
	/* Methods */

	/* Construction */
	$templates = $app->sql->get('job_form_template')->all()->run();
	$app->build->page('views/templates.html', [
		'templates' => $templates
	]);
});