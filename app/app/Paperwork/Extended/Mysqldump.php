<?php

namespace Paperwork\Extended;

class Mysqldump {
	
	protected $username;
	protected $password;
	
	public function __construct(){
		$this->username = $_ENV['DB_USER'];
		$this->password = $_ENV['DB_PASSWORD'];
	}
	
	public function backup(){
		$app = \Slim\Slim::getInstance();
		
		$db = $_ENV['DB_PREFIX'].$app->user['username'];
		exec(
			'mysqldump'
			.' -u '.$this->username
			.' -p'.$this->password
			.' '.$db
			.' > "/var/www/paperwork/app/app/storage/clients/NailedItConstruc/sql/logan.sql"'
		);
	}
	
}