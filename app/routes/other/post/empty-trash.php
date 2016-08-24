<?php

$app->post('/post/empty-trash', 'uac', function() use ($app){
	/* Methods */
	
	/* Construction */
	$app->sql->delete('job')
		->where('date_deleted', '<>', '0000-00-00 00:00:00')
		->hard()
		->run();
	
	$app->sql->delete('document')
		->where('date_deleted', '<>', '0000-00-00 00:00:00')
		->hard()
		->run();
	
	$app->sql->delete('client')
		->where('date_deleted', '<>', '0000-00-00 00:00:00')
		->hard()
		->run();
	
	$app->sql->delete('inventory')
		->where('date_deleted', '<>', '0000-00-00 00:00:00')
		->hard()
		->run();
	
	$app->sql->delete('user_template')
		->where('date_deleted', '<>', '0000-00-00 00:00:00')
		->hard()
		->run();
	
	$app->event->log('emptied their trash');
	
});