<?php

$app->post('/admin/post/query', function() use ($app){
	/* Methods */
	
	/* Construction */
	$q = $_POST['query'];
	
	echo $app->parse->arrayToJson($app->pdo->master->query($q)->fetchAll(PDO::FETCH_ASSOC));
});