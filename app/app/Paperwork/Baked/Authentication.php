<?php

namespace Paperwork\Baked;

use \PDO;

class Authentication {
	
	public function __construct(){
		session_name('Paperwork');
		session_start();
	}
	
	// Re/start a users session with no redirection. If Maintenance Mode is ON, user is logged out.
	private function session($user){
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
			$this->logout($app->root.'/login');
		}
		
		// -> continue to route
	}
	
	// Validate a user with no redirection. If invalid, user is logged out. Run on every route.
	public function validate(){
		$app = \Slim\Slim::getInstance();
		
		if(isset($_COOKIE['@'])){
			if($user = $app->sql->get('master.uac')->where('cookie', '=', $_COOKIE['@'])->run()){ // Valid Cookie
				
				// User is authenticated OK, DB access
				$app->pdo->user = new PDO(
					$_ENV['PDO_DRIVER'].':host='.$_ENV['DB_HOST'].';dbname='.$_ENV['DB_PREFIX'].$user['username'],
					$_ENV['DB_USER'],
					$_ENV['DB_PASSWORD']
				);
				
				// Re/start user session
				$this->session($user);
				
				// -> continue to route
			}else{
				// Invalid cookie, logout
				$this->logout();
			}
		}else{
			// No cookie but an active session
			if(isset($_SESSION['user'])) $this->logout();
			
			// otherwise -> continue to route (guest user)
		}
	}
	
	// Log a user in with a username and password
	public function login($username, $password){
		$app = \Slim\Slim::getInstance();
		
		$username = filter_var($username, FILTER_SANITIZE_STRING);
		$password = filter_var($password, FILTER_SANITIZE_STRING);
		
		if($user = $app->sql->get('master.uac')->where('username', '=', $username)->run()){
			if(!$user['disabled']){
				if(password_verify($password, $user['password'])){
					
					// Set cookie with expiry of 1 year
					setcookie('@', $user['cookie'], time() + 31536000, '/');
					
					// Log
					$app->event->log([
						'number' => 15,
						'title' => $username.' logged in',
						'uacID' => $user['uacID']
					]);
					
					// Not necessary, but fixes redundant logging (user logged in + user resumed session)
					$_SESSION['user'] = $user;
					
					// Start session, also chance for Maintenance Mode to override
					$this->session($user);
					
					// Redirect
					if($user['username'] == 'admin') $app->redirect($app->root.'/admin');
					$app->redirect($app->root.'/jobs');
					
				}else{
					return 'Invalid Password';
				}
			}else{
				return 'User Disabled';
			}
		}else{
			return 'User Does Not Exist';
		}
	}
	
	// Destroy a users session and redirect to home page or a provided location
	public function logout($location = '/'){
		$app = \Slim\Slim::getInstance();
		
		setcookie('@', '', -1, '/');	// Delete @ cookie
		session_destroy();				// Delete PHP session
		
		$app->redirect(
			$location != '/' ? $location : $app->root
		);
	}
	
}