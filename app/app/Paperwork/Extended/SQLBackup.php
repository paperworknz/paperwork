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
		
		$db = $_ENV['DB_PREFIX'].$app->user['username'];
		exec(
			'mysqldump'.
			' -u '.$this->username.
			' -p'.$this->password.
			' '.$db.
			' > '.$this->path
		);
	}
	
}