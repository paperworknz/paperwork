<?php

use Paperwork\Extended\SQLBackup;

$app->post('/admin/post/backup', 'admin', function() use ($app){
	/* Methods */
	$SQLBackup = new SQLBackup;
	
	/* Construction */
	echo $SQLBackup->backup();
	$app->event->log('ran a SQL Backup. Runtime '.round($end - $start, 2));
});