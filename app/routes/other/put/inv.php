<?php

$app->post('/put/inv', 'uac', function() use ($app){
	/* Methods */
	
	/* Construction */
	if(isset($_POST['name']) && isset($_POST['price']) && isset($_POST['id'])){
		$app->sql->put('inventory')->where('id', '=', $_POST['id'])->with([
			'name'	=> $_POST['name'],
			'price'	=> $_POST['price'],
		])->run();
	}else{
		echo '0';
	}
});