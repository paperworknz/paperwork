<?php

// ADMIN ONLY //

$app->get('/admin', 'admin', function() use ($app){
	/* Methods */

	/* Construction */
	$app->build->page('views/admin.html');
});