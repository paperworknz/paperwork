<?php

$app->post('/post/login', function() use ($app){
	$username = $_POST['username'];
	$password = $_POST['password'];
	
	if($user = $app->sql->get('master.uac')->where('username', '=', $username)->run()){
		if(!$user['disabled']){
			if(password_verify($password, $user['password'])){
				if(password_needs_rehash($user['password'], PASSWORD_DEFAULT)){
					$user['password'] = password_hash($password, PASSWORD_DEFAULT);
				}
				
				$cookie = $user['cookie'];
				
				// If cookie is real
				if(strlen($cookie) == 64){
					// Set/update client cookie to user cookie and touch user
					setcookie('@', $cookie, time() + 31536000, '/');
				}else{
					// Create new cookie, set client cookie to new cookie and touch user
					$cookie = bin2hex(random_bytes(32));
					setcookie('@', $cookie, time() + 31536000, '/');
					
					// Update users cookie
					$app->sql->put('master.uac')->where('username', '=', $username)->with([
						'cookie' => $cookie,
					])->run();
				}
				
				$app->event->log([
					'number' => 15,
					'title' => $username.' logged in',
					'uacID' => $user['uacID']
				]);
				$app->cookie->session($cookie, $user);
				if($user['username'] == 'admin'){
					$app->redirect($app->root.'/admin');
				}
				$app->redirect($app->root.'/jobs');
			}
		}else{
			$app->event->log([
				'number' => 2,
				'title' => 'Disabled Account Login Attempt',
				'text' => $username.' is disabled and has tried to log in.',
				'user' => $user['uacID']
			]);
			$app->flash('error', 'This account is currently disabled. Please contact us if you think this is in error.');
			$app->redirect($app->root);
		}
	}
	$app->event->log([
		'number' => 1,
		'title' => 'Failed Login Attempt',
		'text' => 'Username: "'.$username.'" does not exist.',
	]);
	$app->flash('error', 'Your username or password was incorrect.');
	$app->redirect($app->root);
});