<?php

$app->post('/admin/post/query', 'admin', function() use ($app){
	/* Methods */
	
	/* Construction */
	$q = $_POST['query'];
	
	echo $app->parse->arrayToJson($app->sql->raw($q));
	$app->event->log('ran SQL query: '.$q);
});