<?php

use Paperwork\Extended\ID;

$app->post('/post/inv', 'uac', function() use ($app){
	/* Methods */
	$ID = new ID;
	
	/* Contract */
	/*
		GET
		dump: NOT FINISHED
	*/
	
	/* Construction */
	if(isset($_POST['name']) && isset($_POST['price'])){
		$_POST['name'] = preg_replace('/\s+/', ' ',$_POST['name']);
		if($app->sql->get('inv')->where('name', '=', $_POST['name'])->run()){
			$app->sql->put('inv')->with([
				'name' => $_POST['name'],
				'price' => $_POST['price']
			])->where('name', '=', $_POST['name'])->run();
		}else{
			$app->sql->post('inv')->with([
				'name' => $_POST['name'],
				'price' => $_POST['price']
			])->run();
		}
	}else if(isset($_POST['dump'])){
		$typeID = 1;
		$dump = $_POST['dump'];
		$blob = [];
		
		foreach($dump as $a){
			$blob[$a['name']] = $a['price'];
		}
		
		foreach($blob as $a => $b){
			if(!$app->sql->get('inv')->where('name', '=', $a)->run()){
				$app->sql->post('inv')->with([
					'name' => $a,
					'price' => $b
				])->run();
			}
		}
		
		echo 'OK';
	}else{
		echo '0';
	}
});