<?php

$app->get('/get/inv', 'uac', function() use ($app){
	/* Methods */
	
	/* Construction */
	$raw = $app->sql->get('inv')->all()->run();
	$inv = [];
	foreach($raw as $case){
		$inv[$case['name']] = $case['price'];
	}
	
	echo $app->parse->arrayToJson($inv);
});