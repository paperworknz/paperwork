<?php

use Paperwork\Extended\SQLBackup;

$app->post('/admin/post/backup', function() use ($app){
	/* Methods */
	$SQLBackup = new SQLBackup;
	
	/* Construction */
	echo $SQLBackup->backup();
});