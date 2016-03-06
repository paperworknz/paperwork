<?php

$app->post('/post/army', 'uac', function() use ($app){
	/* Methods */
	
	/* Construction */
	$army = $app->sql->get('job_cache')->where('formjs', '=', 'Armadyl.js')->run();
	
	$app->sql->put('job')->where('jobID', '=', $_POST['jobID'])->with([
		'cacheID' => $army['cacheID']
	])->run();
	
	echo 'true';
});