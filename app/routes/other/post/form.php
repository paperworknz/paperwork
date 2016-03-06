<?php

use Paperwork\Extended\Form;

$app->post('/post/form', 'uac', function() use ($app){
	/* Methods */
	$form = new Form;
	
	/* Construction */
	if(isset($_POST['templateID']) && isset($_POST['jobID']) && isset($_POST['clientID'])){
		// Vars
		$jobID		= $_POST['jobID'];
		$clientID	= $_POST['clientID'];
		$job = $app->sql->get('job')->where('jobID', '=', $jobID)->run(); // Job array
		$templates = $app->parse->jsonToArray($job['cache']['content']); // Templates array
		
		// Attempt to use the given templateID
		if($template = $templates[$_POST['templateID']]){
			// Post a new form
			$formID = $app->sql->post('job_form')->with([
				'clientID'	=> $clientID,
				'jobID'		=> $jobID,
				'name'		=> $template['name'],
				'html'		=> $template['content']
			])->run();
			
			$client = $app->sql->get('client')->where('clientID', '=', $clientID)->run();
			$html	= $app->build->page('other/inc/html/form.html', ['html' => $template['content']], false);
			$json = [
				'formID'	=> $formID,
				'name'		=> $template['name'],
				'html'		=> $html,
				'date'		=> date("d/m/Y"),
				'client'	=> $client['name'].'<br>'.$client['address']
			];
			echo $app->parse->arrayToJson($json);
		}
	}else{
		echo '0';
	}
});