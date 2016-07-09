<?php

$app->get('/kappa', 'uac', function() use ($app){
	/* Methods */
	
	/* Construction */
	echo phpinfo();
});