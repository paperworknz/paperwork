<?php

use Paperwork\Extended\Form,
	Symfony\Component\Process\Process,
	Symfony\Component\HttpFoundation\Response;

$app->get('/job/:a', 'uac', function($a) use ($app){
	/* Methods */
	$form = new Form;
	
	/* Construction */
	$cache_id = $form->cache(); // Update job_cache if necessary
	if($job = $app->sql->get('job')->where('job_number', '=', $a)->one()){
		if(isset($job['job_cache'])){
			
			$app->sql->touch('job')->where('id', '=', $job['id'])->run();
			
			$client	= $job['client'];
			$status	= $app->sql->get('job_status')->select(['name'])->all();
			unset($job['client']);
			
			// TABS PART ONE //
			$forms = [];
			/* $tabs = [
				[formID] => [
					'blob' => '<html>....</html>',
					'name' => 'Quote',
				],
				[formID] => [...]
			]; */
			
			// TABS => FORMS //
			if($form = $app->sql->get('job_form')->where('job_id', '=', $job['id'])->all()){
				foreach($form as $item){
					$forms[$item['id']] = [
						'name'	=> $item['name'],
						'html'	=> $item['html'],
					];
				}
			}
			
			// TEMPLATES //
			$templates = $app->parse->jsonToArray($job['job_cache']['content']);
			$job['painter'] = $job['job_cache']['painter'];
			unset($job['cache']);
			
			// $html = ($job['status']['statusID'] == 0) ? 'views/job/_archived.html' : 'views/job/_job.html';
			$html = 'views/job/_job.html';
			
			// $resources = 'form.js?aBcdEf
			$resources = $app->parse->jsonToArray(file_get_contents('../app/app/resources/.resources'));
			
			// Time Since
			foreach($job as $key => $value){
				if(in_array($key, ['date_created', 'date_touched', 'date_invoiced', 'date_completed'])){
					
					$now = new DateTime();
					$time = new DateTime($value);
					$diff = $now->diff($time);
					
					if($value == '0000-00-00 00:00:00'){
						$job[$key] = false;
						continue;
					}
					
					$job[$key] = $time->format("d-m-Y, g:i A");
					
					if($time->format('d') == $now->format('d') - 1){
						$job[$key.'_pretty'] = 'Yesterday at '.$time->format('g:i A');
						continue;
					}
					
					if($diff->d === 0 && $diff->m === 0 && $diff->y === 0){
						if($diff->h === 0){
							if($diff->i === 0){
								$job[$key.'_pretty'] = 'Just now';
							}else{
								$job[$key.'_pretty'] = $diff->i.'m ago';
							}
						}else{
							$job[$key.'_pretty'] = $diff->h.'h ago';
						}
					}else{
						$job[$key.'_pretty'] = $time->format("d F Y");
					}
				}
			}
			
			// EMAIL
			if(!$email = $app->sql->get('user_email_settings')->one()){
				$email = false;
			}
			
			return $app->build->page($html, [
				'id'		=> $a,
				'job'		=> $job,
				'client'	=> $client,
				'templates'	=> $templates,
				'status'	=> $status,
				'forms'		=> $forms,
				'resources'	=> $resources,
				'email'		=> $email,
			]);
		}else{
			$app->sql->put('job')->with([
				'job_cache_id' => $cache_id
			])->where('id', '=', $job['id'])->run();
			$app->flash('info', 'This job had to be repaired automatically.<br> If you experience any problems please <b>do not make any changes</b> and contact support. Thank you.');
			$app->redirect($app->root.$app->request->getResourceUri());
		}
	}else{
		$app->flash('error', 'Oops. That job number doesn\'t exist.');
		$app->redirect($app->root.'/jobs');
	}
});