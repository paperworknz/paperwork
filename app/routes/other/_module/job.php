<?php

$app->module->add('job', function($request) use ($app){
	
	if(!$request) die($app->build->error('Job number not provided'));
	
	$job_number = $request[0];
	
	$documents; // Documents from SQL table: document
	$template = [];
	$templates = [];
	$template_id = [];
	$user_templates = $app->sql->get('user_template')->retain(['template_id'])->all();
	
	$job = $app->sql->get('job')->where('job_number', '=', $job_number)->one();
	$email = $app->sql->get('user_email_settings')->one();
	$status	= $app->sql->get('job_status')->select(['name'])->also('ORDER BY job_status_number')->all();
	
	// ERROR HANDLING //
	
	if(!$job){
		$app->flash('error', "Oops. Job {$job_number} doesn't exist.");
		$app->redirect($app->root.'/jobs');
	}
	
	// CLIENT //
	$client	= $job['client'];
	
	// PRETTY DATES
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
	
	// TEMPLATES //
	// We are replicating a SQL join. The resulting data is an array of 
	// user_template with the template property as the appropriate template data
	
	foreach($user_templates as $data) array_push($template_id, $data['template_id']);
	$templates = $app->sql->get('template')->where('id', 'IN', $template_id)->root()->all();
	
	foreach($user_templates as $data){
		foreach($templates as $value){
			if($value['id'] != $data['template_id']) continue;
			
			array_push($template, [
				'id' => $data['id'],
				'name' => $data['name'],
				'template' => $value,
			]);
			
			break;
		}
	}
	
	// DOCUMENTS //
	$documents = $app->sql->get('document')->where('job_id', '=', $job['id'])->select([
		'id', 'name', 'user_template_id', 
	])->all();
	
	// Insert template into each document's user_template property
	foreach($documents as $key => $value){
		foreach($template as $data){
			if($value['user_template']['id'] == $data['id']){
				$documents[$key]['user_template'] = $data;
			}
		}
	}
	
	unset($job['client']);
	unset($templates);
	unset($template_id);
	
	return [
		'third' => ['typeahead', 'interact', 'contextmenu', 'selection', 'sortable'],
		'classes' => ['Typeahead'],
		'behaviors' => ['tab', 'document'],
		'data' => [
			'id'		=> $job_number,
			'job'		=> $job,
			'client'	=> $client,
			'email'		=> $email,
			'status'	=> $status,
			'templates'	=> $template,
			'documents'	=> $documents,
		],
	];
});