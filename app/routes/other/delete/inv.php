<?php

$app->post('/delete/inv', 'uac', function() use ($app){
	/* Methods */
	
	/* Construction */
	if(isset($_POST['invID'])){
		if($inv = $app->sql->get('inv')->where('invID', '=', $_POST['invID'])->run()){
			$app->sql->delete('inv')->where('invID', '=', $_POST['invID'])->run();
		}
	}else{
		echo '0';
	}
});