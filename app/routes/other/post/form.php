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
			
			// Parse
			$html = $template['content'];
			$html = str_replace('@firstname', $app->user['first'], $html);
			$html = str_replace('@lastname', $app->user['last'], $html);
			$html = str_replace('@name', $app->user['first'].' '.$app->user['last'], $html);
			$html = str_replace('@company', $app->user['company'], $html);
			$html = str_replace('@email', $app->user['email'], $html);
			$html = str_replace('@address', $app->user['address'], $html);
			$html = str_replace('@phone', $app->user['phone'], $html);
			
			$html = str_replace('@clientname', $client['name'], $html);
			$html = str_replace('@clientaddress', $client['address'], $html);
			$html = str_replace('@clientemail', $client['email'], $html);
			$html = str_replace('@clientphone', $client['phone'], $html);
			$html = str_replace('@date', date("d/m/Y"), $html);
			$html = str_replace('@id', $job['job_number'], $html);
			
			// Post a new form
			$id = $app->sql->post('job_form')->with([
				'job_id'	=> $job['id'],
				'client_id'	=> $client['id'],
				'name'		=> $template['name'],
				'html'		=> $html
			])->run();
			
			$email = $app->sql->get('user_email_settings')->all();
			
			$html = $app->build->page('other/html/form.html', [
				'html' => $html,
				'email' => $email,
				'job' => $job,
			], false);
			
			$json = [
				'id'		=> $id,
				'name'		=> $template['name'],
				'html'		=> $html,
				'date'		=> date("d/m/Y"),
				'client'	=> $client['name'].'<br>'.$client['address']
			];
			
			$app->event->log('created a new form: '.$id);
			
			echo $app->parse->arrayToJson($json);
		}
	}else{
		echo '0';
	}
});