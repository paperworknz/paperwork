<?php

$app->post('/admin/post/query', function() use ($app){
	/* Methods */
	
	/* Construction */
	$q = $_POST['query'];
	
	echo $app->parse->arrayToJson($app->sql->raw($q));
});