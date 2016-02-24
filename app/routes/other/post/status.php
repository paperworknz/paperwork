<?php

$app->post('/post/status', 'uac', function() use ($app){
	/* Methods */
	
	/* Construction */
	if(isset($_POST['data'])){
		$k = $_POST['data'];
		
		foreach($k as $a => $b){
			if(isset($b['ID'])){
				if($b['name'] != ''){
					$app->sql->put('job_status')->with([
						'name' => $b['name']
					])->where('statusID', '=', $b['ID'])->run();
				}
			}else if(isset($b['name'])){
				if($b['name'] != ''){
					$app->sql->post('job_status')->with([
						'name' => $b['name']
					])->run();
				}
			}
		}
	}
});