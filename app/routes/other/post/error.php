<?php

$app->post('/post/error', function() use ($app){
	/* Methods */
	$message = isset($_POST['message']) ? $_POST['message'] : false;
	$url = isset($_POST['url']) ? $_POST['url'] : false;
	$line = isset($_POST['line']) ? $_POST['line'] : false;
	$column = isset($_POST['column']) ? $_POST['column'] : false;
	$error = isset($_POST['error']) ? $_POST['error'] : false;
	
	/* Construction */
	$app->event->log([
		'text' => 'JS Error: '.PHP_EOL
			.'message: '.$message.PHP_EOL
			.'url: '.$url.PHP_EOL
			.'line: '.$line.PHP_EOL
			.'column: '.$column.PHP_EOL
			.'error: '.$error,
		'icon' => 'error.png',
	]);
	
});