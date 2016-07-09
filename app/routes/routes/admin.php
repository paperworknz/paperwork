<?php

// ADMIN ONLY //

$app->get('/admin', 'uac', 'admin', function() use ($app){
	/* Methods */

	/* Construction */
	$app->build->page('views/admin.html');
});