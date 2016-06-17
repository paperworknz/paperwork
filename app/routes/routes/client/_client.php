<?php

$app->get('/client/:a', 'uac', function($a) use ($app){
	/* Methods */
	
	/* Construction */
	if($client = $app->sql->get('client')->where('client_number', '=', $a)->one()){
		
		//$app->sql->touch('client')->where('id', '=', $client['id'])->run();
		
		$jobs = $app->sql->get('job')
			->select(['id', 'job_number', 'name', 'client_id', 'job_status_id'])
			->where('client_id', '=', $client['id'])
			->also('ORDER BY job_number DESC')
			->all();
		
		$status = $app->sql->get('job_status')->select(['name'])->also('ORDER BY job_status_number')->all();
		
		return $app->build->page('views/client/$client.html', [
			'client'	=> $client,
			'jobs'		=> $jobs,
			'status'	=> $status,
		]);
		
	}else{
		$app->flash('error', 'We looked everywhere but we couldn\'t find the client you were looking for.');
		$app->redirect($app->root.'/clients');
	}
}); 