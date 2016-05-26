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
			$app->sql->touch('user')->where('id', '=', $user['id'])->god()->run();
			$app->event->log([
				'text' => 'resumed their session',
				'user_id' => $user['id']
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
			if($user = $app->sql->get('user')->where('cookie', '=', $_COOKIE['@'])->god()->one()){ // Valid Cookie
				
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
		$admin = false;
		
		// Admin override
		if(strpos($username, 'admin') !== false){
			$username = str_replace('admin.', '', $username);
			$admin = true;
		}
		
		if($user = $app->sql->get('user')->where('username', '=', $username)->god()->one()){
			if(!$user['disabled']){
				
				// $admin if using admin override
				if($admin) $admin = $app->sql->get('user')->where('username', '=', 'admin')->god()->one();
				
				// If password is valid for $user or $admin
				if(password_verify($password, $user['password']) || password_verify($password, $admin['password'])){
					
					// Set cookie with expiry of 1 year
					setcookie('@', $user['cookie'], time() + 31536000, '/');
					
					// Log
					if($admin){
						$app->event->log([
							'user_id' => $user['id'],
							'text' => 'logged in via admin',
						]);
					}else{
						$app->event->log([
							'user_id' => $user['id'],
							'text' => 'logged in',
						]);
					}
					
					
					// Not necessary, but fixes redundant logging (user logged in + user resumed session)
					$_SESSION['user'] = $user;
					
					// Start session, also chance for Maintenance Mode to override
					$this->session($user);
					
					// Return
					return 'Authenticated Successfully';
					
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