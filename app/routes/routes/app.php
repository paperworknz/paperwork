<?php

use Paperwork\Extended\Mysqldump;

$app->get('/app', 'uac', function() use ($app){
	/* Methods */
	$mysqldump = new Mysqldump;
	
	/* Construction */
	$mysqldump->backup();
	$app->build->page('views/app.html');
}); 