<?php

namespace Paperwork\Extended;

use \RecursiveIteratorIterator,
	\RecursiveDirectoryIterator,
	\FilesystemIterator;

class SQLBackup {
	
	protected $username;
	protected $password;
	protected $path;
	protected $upper;
	
	public function __construct(){
		$app = \Slim\Slim::getInstance();
		
		$easy = $app->user['easy'];
		$this->username = $_ENV['DB_USER'];
		$this->password = $_ENV['DB_PASSWORD'];
		
		if($_ENV['MODE'] == 'prod'){
			$this->path = '/var/www/Dropbox/Paperwork/';
			$this->upper = 100000000; // Retention file size before files start getting removed (100Mb)
			// Rationale is 100 users get 100Mb each = 10Gb
		}else{
			$this->path = '../app/app/storage/temp/';
			$this->upper = 50000; // (50Kb)
		}
	}
	
	public function backup($env = false){
		$app = \Slim\Slim::getInstance();
		
		// SQLBackup can only run in production OR if backup(true) 
		if($_ENV['MODE'] == 'prod' || $env){
			$start = microtime(true); // Start clock
			
			$db = $_ENV['DB_PREFIX'].$app->user['username']; // Database name
			$path = $this->path.$app->user['easy'].'/sql/'; // Save path
			$name = date("Y-m-d_His").'.sql'; // Name of sql file
			
			if($_ENV['MODE'] == 'prod'){
				exec(
					'mysqldump'.
					' -u '.$this->username.
					' -p'.$this->password.
					' app_logan'.
					' > '.
					$path.$name
				);
			}else{
				$test = fopen($this->path.$name, 'w');
				$stuff = file_get_contents('../app/app/resources/db_schema/app_default.sql');
				fwrite($test, $stuff);
				fclose($test);
			}
			
			//$this->gzCompress($this->path.$name); // gz compress file
			//$this->retention(); // Apply retention
			
			$end = microtime(true); // End clock
			
			$app->event->log([
				'title' => 'mysqldump for '.$app->user['username'],
				'text' => 'This took '.round($end - $start, 2).' seconds to run',
				'uacID' => $app->user['uacID'],
				'number' => 3000 
			]);
		}
	}
	
	private function retention(){
		$app = \Slim\Slim::getInstance();
		
		$files = [];
		
		foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($this->path)) as $filename => $file) {
			$file = str_replace($this->path, '', $file);
			$file = str_replace('\\', '/', $file);
			$file = str_replace('/..', '/', $file);
			$file = str_replace('/.', '/', $file);
			if(substr($file, -1) != '/'){
				$file = str_replace($this->path, '', $file);
				$files[] = $file;
			}
		}
		
		$bytes = 0;
		foreach(new RecursiveIteratorIterator(new RecursiveDirectoryIterator($this->path, FilesystemIterator::SKIP_DOTS)) as $object){
			$bytes += filesize($object);
		}
		
		if($bytes > $this->upper){
			unlink($this->path.reset($files));
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