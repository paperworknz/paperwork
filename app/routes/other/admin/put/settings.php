<?php

$app->post('/admin/put/settings', 'admin', function() use ($app){
	/* Methods */
	
	/* Construction */	
	$app->sql->put('user')->with($_POST)->where('id', '=', $_POST['id'])->root()->run();
	
	$app->event->log('updated '.$_POST['first'].'\'s user properties');
	
	$app->flash('success', 'Updated');
	$app->redirect($app->root.'/user/'.$_POST['id']);
});