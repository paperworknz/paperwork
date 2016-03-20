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
		$this->path = "/var/www/paperwork/app/app/storage/clients/{$easy}/sql/{$user}.sql";
	}
	
	public function backup(){
		$app = \Slim\Slim::getInstance();
		
		if(!strncasecmp(PHP_OS, 'WIN', 3) == 0){ // Not Windows
			
			$db = $_ENV['DB_PREFIX'].$app->user['username'];
			
			$start = microtime(true);
			
			exec(
				'mysqldump'.
				' -u '.$this->username.
				' -p'.$this->password.
				' '.$db.
				' > '.$this->path
			);
			
			$end = microtime(true);
			
			$app->event->log([
				'title' => 'mysqldump for '.$app->user['username'],
				'text' => 'This took: '.($end - $start).' seconds to complete',
				'uacID' => $app->user['uacID']
			]);
		}
	}
	
}