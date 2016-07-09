<?php

namespace Paperwork\Extended;

use \RecursiveIteratorIterator,
	\RecursiveDirectoryIterator,
	\FilesystemIterator;

class SQLBackup {
	
	protected $database;
	protected $username;
	protected $password;
	protected $path;
	protected $upper;
	
	public function __construct(){
		$app = \Slim\Slim::getInstance();
		
		$easy = $app->user['easy'];
		$this->database = $_ENV['DATABASE'];
		$this->username = $_ENV['DB_USER'];
		$this->password = $_ENV['DB_PASSWORD'];
		
		if($_ENV['MODE'] == 'prod'){
			$this->path = '/var/www/Dropbox/Paperwork/sql/';
			$this->upper = 1000000000; // Retention file size before files start getting removed (1 Gb)
		}else{
			$this->path = '../app/app/storage/temp/sql/';
			$this->upper = 25000; // (25 Kb)
		}
	}
	
	public function backup($env = false){
		$app = \Slim\Slim::getInstance();
		
		// SQLBackup can only run in production OR if backup(true) 
		if($_ENV['MODE'] == 'prod' || $env){
			$start = microtime(true); // Start clock
			
			$name = date("Y-m-d_His").'.sql'; // Name of sql file
			
			if($_ENV['MODE'] == 'prod'){
				exec(
					'mysqldump'.
					' -u '.$this->username.
					' -p'.$this->password.
					' '.$this->database.
					' > '.
					$this->path.$name,
					
					$result
				);
			}else{
				$test = fopen($this->path.$name, 'w');
				$stuff = file_get_contents('../app/app/bin/phpToPDF.php');
				fwrite($test, $stuff);
				fclose($test);
				$result = 'Development environment';
			}
			
			// gzCompress($this->path.$name, 9); // gz compress file --> Doesn't seem to work atm
			$this->retention(); // Apply retention
			
			$end = microtime(true); // End clock
			
			$app->event->log('ran a SQL Backup. Runtime '.round($end - $start, 2));
			
			return $app->build->success([
				'message' => $result
			]);
		}
		
		return $app->build->success([
			'message' => 'Development environment'
		]);
		
	}
	
	private function retention(){
		$app = \Slim\Slim::getInstance();
		
		$files = [];
		
		foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($this->path, FilesystemIterator::SKIP_DOTS)) as $filename => $file) {
			$file = realpath($file);
			$files[] = $file;
		}
		
		$bytes = 0;
		foreach(new RecursiveIteratorIterator(new RecursiveDirectoryIterator($this->path, FilesystemIterator::SKIP_DOTS)) as $object){
			$bytes += filesize($object);
		}
		
		if($bytes > $this->upper){
			natsort($files);
			unlink(reset($files));
		}
	}
	
	private function gzCompress($source, $level = 9){
		/**
		* GZIPs a file on disk (appending .gz to the name)
		*
		* From http://stackoverflow.com/questions/6073397/how-do-you-create-a-gz-file-using-php
		* Based on function by Kioob at:
		* http://www.php.net/manual/en/function.gzwrite.php#34955
		* 
		* @param string $source Path to file that should be compressed
		* @param integer $level GZIP compression level (default: 9)
		* @return string New filename (with .gz appended) if success, or false if operation fails
		*/
		$dest = $source . '.gz';
		$mode = 'wb' . $level;
		$error = false;
		if ($fp_out = gzopen($dest, $mode)) {
			if ($fp_in = fopen($source,'rb')) {
				while (!feof($fp_in))
				gzwrite($fp_out, fread($fp_in, 1024 * 512));
				fclose($fp_in);
			}else{
				$error = true; 
			}
			gzclose($fp_out); 
		}else{
			$error = true; 
		}
		return $error ? false : $dest;
	} 
	
}