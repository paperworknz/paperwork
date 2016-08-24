<?php

use Paperwork\Extended\SQLBackup;

$app->post('/admin/post/backup', 'admin', function() use ($app){
	/* Methods */
	$SQLBackup = new SQLBackup;
	
	/* Construction */
	
	echo $SQLBackup->backup();
});