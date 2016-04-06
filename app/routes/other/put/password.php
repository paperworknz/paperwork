<?php

$app->post('/put/password', 'uac', function() use ($app){
	$old = $_POST['oldpw'];
	$new = $_POST['newpw'];
	$con = $_POST['confirmpw'];
	
	// This should re-use the login logic //
	
	if($new == $con){ // Check if new password is the same as the confirm
		if(password_verify($old, $app->user['password'])){ // Old password is correct
		
			// Hash new password
			$password = password_hash($new, PASSWORD_DEFAULT);
			
			// Update user's password
			$app->sql->put('master.uac')->where('uacID', '=', $app->user['uacID'])->with([
				'password' => $password
			])->run();
			
			$app->flash('success', 'Password changed successfully!');
			$app->redirect($app->root.'/settings');
			
		}else{
			$app->flash('error', 'Old password was incorrect.');
			$app->redirect($app->root.'/settings');
		}
	}else{
		$app->flash('error', 'New password did not match each other.');
		$app->redirect($app->root.'/settings');
	}
});