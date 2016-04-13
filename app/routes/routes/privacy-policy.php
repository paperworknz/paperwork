<?php

$app->get('/privacy-policy', 'app', function() use ($app){
	/* Methods */

	/* Construction */
	$app->build->page('views/privacy-policy.html');
});