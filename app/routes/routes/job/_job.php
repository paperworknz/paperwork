<?php

use Paperwork\Extended\Form,
	Symfony\Component\Process\Process,
	Symfony\Component\HttpFoundation\Response;

$app->get('/job/:a', 'uac', function($a) use ($app){
	/* Methods */
	$form = new Form;
	
	/* Construction */
	$cacheID = $form->cache(); // Update job_cache if necessary
	if($job = $app->sql->get('job')->where('jobID', '=', $a)->by('jobID DESC')->run()){
		if($job['cache']){
			$client		= $app->sql->get('client')->where('clientID', '=', $job['client']['clientID'])->run();
			$inv		= $app->sql->get('inv')->by('name ASC')->all()->run();
			$status		= $app->sql->get('job_status')->all()->run();
			
			// TABS PART ONE //
			$tabs = [];
			/* $tabs = [
				[formID] => [
					'blob' => '<html>....</html>',
					'name' => 'Quote',
					'path' => 'storage/clients/x/x.pdf'
				],
				[formID] => [...]
			]; */
			
			// TABS => FORMS //
			if($forms = $app->sql->get('job_form')->where('jobID', '=', $a)->all()->run()){
				foreach($forms as $item){
					$tabs[$item['formID']] = [
						'blob'	=> $item['content'],
						'name'	=> $item['name']
					];
				}
			}
			
			// TEMPLATES //
			$templates = $app->parse->jsonToArray($job['cache']['content']);
			$job['formjs'] = $job['cache']['formjs'];
			unset($job['cache']);
			
			//$html = ($job['status']['statusID'] == 0) ? 'views/job/_archived.html' : 'views/job/_job.html';
			$html = 'views/job/_job.html';
			
			return $app->build->page($html, [
				'jobID'		=> $a,
				'job'		=> $job,
				'templates'	=> $templates,
				'client'	=> $client,
				'status'	=> $status,
				'inv'		=> $inv,
				'tabs'		=> $tabs,
			]);
		}else{
			$app->sql->put('job')->with([
				'cacheID' => $cacheID
			])->where('jobID', '=', $job['jobID'])->run();
			$app->flash('info', 'This job had to be repaired automatically.<br> If you experience any problems please <b>do not make any changes</b> and contact support. Thank you.');
			$app->redirect($app->root.$app->request->getResourceUri());
		}
	}else{
		$app->flash('error', 'Oops. That job number doesn\'t exist.');
		$app->redirect($app->root.'/jobs');
	}
});