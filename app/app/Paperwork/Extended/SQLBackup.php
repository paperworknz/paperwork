<?php

namespace Paperwork\Extended;

class SQLBackup {
	
	protected $username;
	protected $password;
	protected $path;
	
	public function __construct(){
		$app = \Slim\Slim::getInstance();
		
		$easy = $app->user['easy'];
		$user = $app->user['username'];
		$this->username = $_ENV['DB_USER'];
		$this->password = $_ENV['DB_PASSWORD'];
		$this->path = "/var/www/Dropbox/Paperwork/{$easy}/sql/";
	}
	
	public function backup($env = false){
		$app = \Slim\Slim::getInstance();
		
		$app->event->log([
			'title' => 'test'
		]);
		
		// SQLBackup can only run in production OR if backup(true) 
		if($_ENV['MODE'] == 'prod' || $env){
			$db = $_ENV['DB_PREFIX'].$app->user['username'];
			
			$start = microtime(true);
			$name = date("Y-m-d_His").'.sql';
			exec(
				'mysqldump'.
				' -u '.$this->username.
				' -p'.$this->password.
				' '.$db.
				' > "'.$this->path.$name.'"'
			);
			$end = microtime(true);
			
			$app->event->log([
				'title' => 'mysqldump for '.$app->user['username'],
				'text' => 'This took '.round($end - $start, 2).' seconds to run',
				'uacID' => $app->user['uacID'],
				'number' => 3000 
			]);
		}
	}
	
}