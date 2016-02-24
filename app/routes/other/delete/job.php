<?php

$app->post('/delete/job', 'uac', function() use ($app){
	if(isset($_POST['jobID'])){
		$app->sql->delete('job_form')->where('jobID', '=', $_POST['jobID'])->run();
		$app->sql->delete('job')->where('jobID', '=', $_POST['jobID'])->run();
	}
	$app->redirect($app->root.'/jobs');
});