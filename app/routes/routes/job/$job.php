<?php

$app->get('/job/$job', 'uac', function() use ($app){
	/* Methods */

	/* Construction */
	$app->build->page('views/job/$job.html');
});