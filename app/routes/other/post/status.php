<?php

$app->post('/post/status', 'uac', function() use ($app){
	/* Methods */
	
	/* Construction */
	if(isset($_POST['data'])){
		$k = $_POST['data'];
		$statuses = $app->sql->get('job_status')->all();
		
		foreach($k as $a => $b){
			if(isset($b['id'])){
				if($b['name'] != ''){
					$app->sql->put('job_status')->with([
						'name' => $b['name']
					])->where('id', '=', $b['id'])->run();
				}
			}else if(isset($b['name'])){
				$ok = true;
				if($b['name'] != ''){
					foreach($statuses as $status){
						if($status['name'] == $b['name']){
							$ok = false;
						}
					}
					if($ok){
						$app->sql->post('job_status')->with([
							'name' => $b['name'],
							'job_status_number' => ($a + 1),
						])->run();
					}
				}
			}
		}
		
		$app->flash('success', 'Updated');
	}
});