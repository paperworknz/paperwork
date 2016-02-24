<?php

$app->post('/post/database', function() use ($app){
	/* Methods */
	
	/* Construction */
	$username = $_POST['username'];
	$raw = file_get_contents('../app/app/resources/db_schema/sql_schema.sql'); // Load SQL structure script
	$raw = str_replace('{{database}}', $_ENV['DB_PREFIX'].$username, $raw); // Replace placeholder with `app_$username`
	
	try{
		$app->pdo->master->exec($raw);
		echo 1;
	}catch(PDOException $e){
		echo $e;
	}
	
});