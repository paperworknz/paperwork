<?php

$app->post('/post/client', 'uac', function() use ($app){
	/* Methods */
	
	/* Contract
		GET
		name: String
		
		RETURN
		json: {
			'type': 'success/error',
			'client': {client},
			'message': String
		}
	*/
	
	/* Construction */
	if(isset($_POST['name']) && $_POST['name'] != ''){
		$name = $_POST['name'];
		if(!$client = $app->sql->get('client')->where('name', '=', $name)->run()){ // Check if client already exists
			$app->sql->post('client')->with(['name' => $name])->run();
			$client = $app->sql->get('client')->where('name', '=', $name)->run();
			echo $app->build->success([
				'client' => $client
			]);
		}else{
			echo $app->build->error('<a href="'.$app->root.'/client/'.$client['clientID'].'">'.$name.'</a> already exists!');
		}
	}else{
		echo $app->build->error('There was a problem with the client\'s name, please enter a valid name.');
	}
});