<?php

namespace Paperwork\Baked;

class Cookie {
	
	public function session($cookie, $user){
		$app = \Slim\Slim::getInstance();
		
		if(!isset($_SESSION['user'])){ // Touch user if session has expired
			$app->sql->touch('master.uac')->where('uacID', '=', $user['uacID'])->run();
			$app->event->log([
				'number' => 10,
				'title' => $user['username'].' resumed their session',
				'uacID' => $user['uacID']
			]);
		}
		
		$_SESSION['user'] = $app->user = $user; // Start new session from $user
		
		// Maintenance Mode
		if($app->env['maintenance'] == 1 && $app->user['username'] != 'admin'){
			$app->flash('info', "We're currently offline for maintenance and will be back up as soon as we can. Sorry about this!");
			$this->destroy();
		}
	}
	
	public function destroy(){
		$app = \Slim\Slim::getInstance();
		
		setcookie('@', '', -1, '/');
		session_destroy();
		
		$app->redirect($app->root);
	}
	
}