<?php

use Paperwork\Extended\Form;

$app->post('/post/form', 'uac', function() use ($app){
	/* Methods */
	$form = new Form;
	$template_id = isset($_POST['template_id']) ? $_POST['template_id'] : false;
	$job_id = isset($_POST['job_id']) ? $_POST['job_id'] : false;
	$client_id = isset($_POST['client_id']) ? $_POST['client_id'] : false;
	
	/* Construction */
	if($template_id && $job_id && $client_id){
		
		// Data
		$job		= $app->sql->get('job')->where('id', '=', $job_id)->one();
		$client		= $app->sql->get('client')->where('id', '=', $client_id)->one();
		$templates	= $app->parse->jsonToArray($job['job_cache']['content']);
		
		if($template = $templates[$template_id]){
			
			// Post a new form
			$id = $app->sql->post('job_form')->with([
				'job_id'	=> $job['id'],
				'client_id'	=> $client['id'],
				'name'		=> $template['name'],
				'html'		=> $template['content']
			])->run();
			
			// Experimental af. Evaluate stored twig variables in form content
			foreach($app->user as $key => $value){
				if(strpos($template['content'], '{{user.'.$key.'}}') === false){
					$template['content'] = str_replace('{{user.'.$key.'}}', '', $template['content']);
				}else{
					$template['content'] = str_replace('{{user.'.$key.'}}', $value, $template['content']);
				}
			}
			
			$html = $app->build->page('other/html/form.html', [
				'html' => $template['content'],
			], false);
			
			$json = [
				'id'		=> $id,
				'name'		=> $template['name'],
				'html'		=> $html,
				'date'		=> date("d/m/Y"),
				'client'	=> $client['name'].'<br>'.$client['address']
			];
			
			$app->event->log('created a new form for job_id: '.$job_id);
			
			echo $app->parse->arrayToJson($json);
		}
	}else{
		echo '0';
	}
});