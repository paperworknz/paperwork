<?php

$app->get('/get/template', 'uac', function() use ($app){
	/* Methods */
	$id = isset($_POST['template_id']) ? $_POST['template_id'] : false;
	
	/* Construction */
	if($id){
		$template = $app->sql->get('job_form_template')->where('id', '=', $id)->one();
		$template = $app->parse->arrayToJson($template);
		echo $template;
	}else{
		echo '0';
	}
});