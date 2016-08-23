<?php

$app->get('/admin/delete/old-users', 'admin', function() use ($app){
	/* Methods */
	
	/* Construction */
	// Get a list of all existing users in table: user
	$users = $app->sql->get('user')->select('id')->root()->all();
	$user_list = [];
	
	foreach($users as $user) array_push($user_list, $user['id']);
	
	// Delete records from appropriate tables where user_id does not relate
	// to an existing user (from user_list)
	$app->sql->delete('client')
		->where('user_id', 'NOT IN', $user_list)
		->hard()
		->root()->run();
	
	$app->sql->delete('document')
		->where('user_id', 'NOT IN', $user_list)
		->hard()
		->root()->run();
	
	$app->sql->delete('inventory')
		->where('user_id', 'NOT IN', $user_list)
		->hard()
		->root()->run();
	
	$app->sql->delete('job')
		->where('user_id', 'NOT IN', $user_list)
		->hard()
		->root()->run();
	
	$app->sql->delete('job_status')
		->where('user_id', 'NOT IN', $user_list)
		->hard()
		->root()->run();
	
	$app->sql->delete('user_template')
		->where('user_id', 'NOT IN', $user_list)
		->hard()
		->root()->run();
	
	$app->sql->delete('tour')
		->where('user_id', 'NOT IN', $user_list)
		->hard()
		->root()->run();
	
	$app->sql->delete('user_email')
		->where('user_id', 'NOT IN', $user_list)
		->hard()
		->root()->run();
	
	$app->sql->delete('user_number')
		->where('user_id', 'NOT IN', $user_list)
		->hard()
		->root()->run();
	
	$app->sql->delete('user_template')
		->where('user_id', 'NOT IN', $user_list)
		->hard()
		->root()->run();
	
	$app->sql->delete('user_template_properties')
		->where('user_id', 'NOT IN', $user_list)
		->hard()
		->root()->run();
	
	echo $app->build->success([
		'messsage' => 'Old users deleted'
	]);
});