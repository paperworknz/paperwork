<?php

use Paperwork\Extended\Number;

$app->post('/post/client', 'uac', function() use ($app){
	/* Methods */
	$number = new Number;
	$name = isset($_POST['name']) ? $_POST['name'] : false;
	
	/* Construction */
	if($name){
		if($name != ''){
			if(!$client = $app->sql->get('client')->where('name', '=', $name)->one()){ // Check if client already exists
				$client_number = $number->next('client');
				$app->sql->post('client')->with([
					'client_number' => $client_number,
					'name' => $name,
				])->run();
				$client = $app->sql->get('client')->where('name', '=', $name)->one();
				
				$app->event->log('created a new client, '.$name);
				echo $app->build->success([
					'client' => $client
				]);
			}else{
				echo $app->build->error('<a href="'.$app->root.'/client/'.$client['client_number'].'">'.$name.'</a> already exists!');
			}
		}else{
			echo $app->build->error('There was a problem with the client\'s name, please enter a valid name.');
		}
	}
});