<?php

$app->post('/post/template-name', 'uac', function() use ($app){
	/* Methods */
	
	/* Construction */
	if($_POST['multiple']){
		$templates = $app->parse->jsonToArray($_POST['data']);
		
		array_unshift($templates, 'ghost');
		unset($templates[0]);
		
		foreach($templates as $key => $value){
			$app->sql->put('job_form_template')->where('id', '=', $key)->with([
				'name' => $value
			])->run();
		}
		
		echo 'Success';
	}
});