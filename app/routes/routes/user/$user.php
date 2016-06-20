<?php

$app->get('/user/$user', 'uac', function() use ($app){
	/* Methods */

	/* Construction */
	$app->build->page('views/user/$user.html');
});