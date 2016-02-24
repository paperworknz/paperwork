<?php

$app->get('/client/:a', 'uac', function($a) use ($app){
	/* Methods */
	
	/* Construction */
	if($client = $app->sql->get('client')->where('clientID', '=', $a)->run()){
		$app->sql->touch('client')->where('clientID', '=', $a)->run();
		$jobs	= $app->sql->get('job')->where('clientID', '=', $a)->all()->run();
		$status = $app->sql->get('job_status')->all()->run();
		return $app->build->page('views/client/_client.html', [
			'client'	=> $client,
			'job'		=> $jobs,
			'status'	=> $status,
		]);
	}else{
		$app->flash('error', 'We looked everywhere but we couldn\'t find the client you were looking for.');
		$app->redirect($app->root.'/clients');
	}
});