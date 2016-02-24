<?php

$app->get('/get/template', function() use ($app){
	/* Methods */
	
	/* Construction */
	if($templateID = $_GET['templateID']){
		$template = $app->sql->get('job_form_templates')->where('templateID', '=', $templateID)->run();
		$template = $app->parse->arrayToJson($template);
		echo $template;
	}else{
		echo '0';
	}
});