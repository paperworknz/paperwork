<?php

use Paperwork\Extended\SQLBackup;

$app->post('/admin/post/backup', 'admin', function() use ($app){
	/* Methods */
	$SQLBackup = new SQLBackup;
	
	/* Construction */
	
	// Get temp users
	$date = date('Y-m-d H:i:s', strtotime('-24 hours', time()));
	$users = $app->sql->get('user')->where('privilege', '=', 'guest')->and('date_touched', '<', $date)->root()->all();
	
	foreach($users as $user){
		
		// Purge users data
		$app->sql->delete('client')->where('user_id', '=', $user['id'])->hard()->root()->run();
		$app->sql->delete('inventory')->where('user_id', '=', $user['id'])->hard()->root()->run();
		$app->sql->delete('job')->where('user_id', '=', $user['id'])->hard()->root()->run();
		$app->sql->delete('job_form')->where('user_id', '=', $user['id'])->hard()->root()->run();
		$app->sql->delete('job_status')->where('user_id', '=', $user['id'])->hard()->root()->run();
		$app->sql->delete('user_email_settings')->where('user_id', '=', $user['id'])->hard()->root()->run();
		$app->sql->delete('tour')->where('user_id', '=', $user['id'])->hard()->root()->run();
		
		// Set to inactive
		$app->sql->put('user')->where('id', '=', $user['id'])->with([
			'first' => 'Guest',
			'last' => 'User',
			'email' => 'your@email.com',
			'company' => 'Your Company Name',
			'active' => '0',
			'privilege' => 'guest',
		])->root()->run();
		
		// Reset user_number
		$app->sql->put('user_number')->where('user_id', '=', $user['id'])->with([
			'client_number' => '1',
			'job_number' => '1',
			'job_status_number' => '1',
		])->root()->run();
	}
	
	// Backup
	echo $SQLBackup->backup();
});