<?php

use Paperwork\Extended\Form;

$app->module->add('job', function($request) use ($app){
	
	if(!$request) die($app->build->error('Job number not provided'));
	
	$form = new Form;
	$cache_id = $form->cache(); // Update job_cache if necessary
	$job_number = $request[0];
	
	if(!$job = $app->sql->get('job')->where('job_number', '=', $job_number)->one()){
		$app->flash('error', 'Oops. That job number doesn\'t exist.');
		$app->redirect($app->root.'/jobs');
	}
	
	if(!isset($job['job_cache'])){
		$app->sql->put('job')->with([
			'job_cache_id' => $cache_id
		])->where('id', '=', $job['id'])->run();
		
		$app->flash('info', 'This job had to be repaired automatically.<br> If you experience any problems please <b>do not make any changes</b> and contact support. Thank you.');
		$app->redirect("$app->root/job/$job_number");
	}
			
	$app->sql->touch('job')->where('id', '=', $job['id'])->run();
	
	$client	= $job['client'];
	$status	= $app->sql->get('job_status')->select(['name'])->also('ORDER BY job_status_number')->all();
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
	
	// $resources = 'form.js?aBcdEf
	$resources = $app->parse->jsonToArray(file_get_contents('../app/app/resources/.resources'));
	
	// Time Since
	foreach($job as $key => $value){
		if(in_array($key, ['date_created', 'date_touched', 'date_invoiced', 'date_completed'])){
			
			$now = new DateTime();
			$time = new DateTime($value);
			$diff = $now->diff($time);
			
			$today = $now->format('d');
			$stamp = $now->format('d');
			
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
				}elseif($today == $stamp){
					$job[$key.'_pretty'] = 'Today at '.$time->format('g:i A');
				}else{
					$job[$key.'_pretty'] = 'Yesterday at '.$time->format('g:i A');
				}
			}else{
				$job[$key.'_pretty'] = $time->format("d F Y");
			}
		}
	}
	
	// EMAIL
	if(!$email = $app->sql->get('user_email_settings')->one()) $email = false;
	
	return [
		'third' => ['typeahead', 'interact', 'contextmenu', 'selection', 'sortable'],
		'classes' => ['Typeahead', $job['painter'], 'Form'],
		'behaviors' => ['tab'],
		'data' => [
			'id'		=> $job_number,
			'job'		=> $job,
			'client'	=> $client,
			'templates'	=> $templates,
			'status'	=> $status,
			'forms'		=> $forms,
			'resources'	=> $resources,
			'email'		=> $email,
		],
	];
});