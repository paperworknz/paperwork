<?php

$app->module->add('app', 'user', function($request) use ($app){
	
	$jobs = $app->sql->get('job')->where('date_invoiced', '!=', '0000-00-00 00:00:00')->and('date_completed', '=', '0000-00-00 00:00:00')->select(['id', 'job_number', 'name', 'client_id', 'date_created', 'date_invoiced'])->all();
	
	// PRETTY DATES
	foreach($jobs as $key => $value){
		
		$date = $value['date_invoiced'];
		
		$now = new DateTime();
		$time = new DateTime($date);
		$diff = $now->diff($time);
		
		$today = $now->format('d');
		$stamp = $now->format('d');
		
		if($date == '0000-00-00 00:00:00'){
			$jobs[$key]['date_invoiced'] = false;
			continue;
		}
		
		$jobs[$key]['date_created'] = $time->format("d-m-Y");
		$jobs[$key]['date_invoiced'] = $time->format("d-m-Y");
		
		if($time->format('d') == $now->format('d') - 1){
			$jobs[$key]['date_invoiced_pretty'] = 'Yesterday at '.$time->format('g:i A');
			continue;
		}
		
		if($diff->d === 0 && $diff->m === 0 && $diff->y === 0){
			if($diff->h === 0){
				if($diff->i === 0){
					$jobs[$key]['date_invoiced_pretty'] = 'Just now';
				}else{
					$jobs[$key]['date_invoiced_pretty'] = $diff->i.'m ago';
				}
			}
		}else{
			$jobs[$key]['date_invoiced_pretty'] = $diff->format("%a").' days ago';
		}
	}
	
	return [
		'data' => [
			'jobs' => $jobs,
		],
	];
});