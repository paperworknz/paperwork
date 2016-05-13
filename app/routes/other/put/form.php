<?php

$app->post('/put/form', 'uac', function() use ($app){
	/* Methods */
	$id = isset($_POST['id']) ? $_POST['id'] : false;
	$html = isset($_POST['html']) ? $_POST['html'] : false;
	$json = isset($_POST['json']) ? $_POST['json'] : false;
	
	/* Construction */
	if($id && $html && $json){
		$html = trim($html);
		$app->sql->put('job_form')->where('id', '=', $id)->with([
			'html' => $html,
			'json' => $json,
		])->run();
	}else{
		echo '0';
	}
});