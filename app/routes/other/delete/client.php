<?php

$app->post('/delete/client', 'uac', function() use ($app){
	if(isset($_POST['clientID'])){
		$app->sql->delete('job_form')->where('clientID', '=', $_POST['clientID'])->run();
		$app->sql->delete('job')->where('clientID', '=', $_POST['clientID'])->run();
		$app->sql->delete('client')->where('clientID', '=', $_POST['clientID'])->run();
	}
	$app->redirect($app->root.'/clients');
});