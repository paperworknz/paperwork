<?php

use Paperwork\Extended\ID,
	Paperwork\Extended\Form;

$app->post('/post/job', 'uac', function() use ($app){
	/* Methods */
	$ID		= new ID;
	$form	= new Form;
	
	/* Construction */
	$jobID = '';
	if(isset($_POST['client']) && isset($_POST['jobID']) && isset($_POST['name'])){
		if($_POST['client'] != '' && $_POST['jobID']){
			if($_POST['name'] != ''){
				/*****************************/
				
				$jobID = $_POST['jobID'];
				$name = $_POST['name'];
				
				// Create new client if client does not exist (weak, experimental)
				if($clientID = $ID->translateID('clientID', $_POST['client'])){
				}else{
					$app->sql->post('client')->with([
						'name' => $_POST['client']
					])->run();
					$clientID = $ID->translateID('clientID', $_POST['client']);
				}
				
				// Build new job_cache array which contains the array and json
				$cacheID = $form->cache();
				
				$app->sql->post('job')->with([
					'jobID'			=> $jobID,
					'clientID'		=> $clientID,
					'statusID'		=> 1, // <----------------- User defined default statusID
					'cacheID'		=> $cacheID,
					'name'			=> $name
				])->run();
				
				$app->redirect($app->root.'/job/'.$jobID); // Redirect to the new job
				
				/*****************************/
			}else{
				$app->flash('error', 'Please enter a job name for '.$_POST['client']);
				$app->redirect($app->root.'/jobs');
			}
		}else{
			$app->flash('error', 'Please select a client and write a job name');
			$app->redirect($app->root.'/jobs');
		}
	}else{
		$app->flash('error', 'Please select a client and write a job name');
		$app->redirect($app->root.'/jobs');
	}
});