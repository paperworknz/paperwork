<?php

$app->get('/recover-account', 'app', function() use ($app){
	/* Methods */

	/* Construction */
	$app->build->page('views/recover-account.html');
});