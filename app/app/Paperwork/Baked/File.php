<?php

namespace Paperwork\Baked;

use \Exception;

class File {
	
	protected static $config = [
		'root'		=> '../app/app/storage',
		'logging'	=> false,
		'logger'	=> false,
	];
	
	protected $query;
	protected $files = [];
	protected $log = [
		'query'	=> null,
		'time'	=> null,
	];
	
	public function __construct(){
		$app = \Slim\Slim::getInstance();
		
		$this->query = [
			'method'	=> false,
			'select'	=> [],
			'folder'	=> false,
			'values'	=> [],
			'return'	=> false,
		];
	}
	
	// CONFIGURE //
	
	public static function configure($array){
		foreach($array as $a => $b){
			self::$config[$a] = $b;
		}
	}
	
	// METHODS //
	
	public function get($folder){
		$this->query['method'] = 'get';
		$this->query['folder'] = $folder;
		return $this;
	}
	
	public function post($folder){
		$this->query['method'] = 'post';
		$this->query['folder'] = $folder;
		return $this;
	}
	
	public function put($folder){
		$this->query['method'] = 'put';
		$this->query['folder'] = $folder;
		return $this;
	}
	
	public function delete($folder){
		$this->query['method'] = 'delete';
		$this->query['folder'] = $folder;
		return $this;
	}
	
	// SELECT //
	
	public function select($values){
		if(is_array($values)){
			$this->query['select'] = $values;
		}else{
			$this->query['select'] = [];
			$this->query['select'][0] = $values;
		}
		return $this;
	}
	
	// PUT VALUES //
	
	public function with($values){
		$this->query['values'] = $values;
		return $this;
	}
	
	// RESULT //
	
	public function one(){
		$this->query['return'] = 'one';
		return $this->run();
	}
	
	public function all(){
		$this->query['return'] = 'all';
		return $this->run();
	}
	
	public function run(){
		$app = \Slim\Slim::getInstance();
		
		// Instantiate the result variable
		$start	= microtime(true); // Start clock
		$result = false;
		$method	= $this->query['method']; // Cache method
		
		// Run appropriate function using $this->query
		switch($this->query['method']){
			case 'get':
				$result = $this->runGet($app); // sets $result as array of result
				break;
			case 'post':
				$result = $this->runPost($app); // sets $result as new ID number
				break;
			case 'put':
				$result = $this->runPut($app); // does not set $result
				break;
			case 'delete':
				$result = $this->runDelete($app); // does not set $result
				break;
		}
		
		if($this->query['return'] == 'one'){
			foreach($result as $file){
				$data = $file;
				break;
			}
		}else{
			$data = $result;
		}
		
		$this->query = [
			'method'	=> false,
			'select'	=> [],
			'folder'	=> false,
			'values'	=> [],
			'return'	=> false,
		];
		
		$end = microtime(true); // End clock
		$this->log['time'] = round($end - $start, 2);
		
		if(self::$config['logging'] != false && is_callable(self::$config['logger'])){
			call_user_func(self::$config['logger'], $this->log);
		}
		
		$this->log = [
			'query' => null,
			'time' => null,
		];
		
		// Return result
		if($data !== false) return $data;
		
	}
	
	// QUERY BUILDER HELPER //
	
	private function add($shard){
		array_push($this->files, $shard);
	}
	
	// QUERY BUILDER //
	
	protected function runGet($app){
		
		// CONSTRUCT PATHS //
		if($this->query['select']){
			foreach($this->query['select'] as $select){
				$path = [];
				$string = '';
				
				array_push($path, self::$config['root']);
				array_push($path, $this->query['folder']);
				array_push($path, $select);
				
				foreach($path as $shard) $string .= trim($shard, ' ').'/';
				$string = trim($string, '/');
				
				$this->add([
					'path' => $string,
					'text' => file_get_contents($string),
				]);
				
				$this->log['query'] .= $string; // Log path
			}
		}
		
		return $this->files;
	}
	
	protected function runPost($app){
		
		// CONSTRUCT PATHS //
		foreach($this->query['values'] as $key => $value){
			$path = [];
			$string = '';
			
			array_push($path, self::$config['root']);
			array_push($path, $this->query['folder']);
			array_push($path, $key);
			
			foreach($path as $shard) $string .= trim($shard, ' ').'/';
			$string = trim($string, '/');
			
			if(file_exists($string)) throw new Exception('File already exists: '.$key);
			
			$file = fopen($string, 'w');
			fwrite($file, $value);
			fclose($file);
			
			$this->add([
				'path' => $string,
				'text' => file_get_contents($string),
			]);
			
			$this->log['query'] .= $string; // Log path
		}
		
		return $this->files;
	}
	
	protected function runPut($app){
		
		// CONSTRUCT PATHS //
		if($this->query['select']){
			foreach($this->query['select'] as $select){
				$path = [];
				$string = '';
				
				array_push($path, self::$config['root']);
				array_push($path, $this->query['folder']);
				array_push($path, $select);
				
				foreach($path as $shard) $string .= trim($shard, ' ').'/';
				$string = trim($string, '/');
				
				if(is_string($this->query['values'])){
					$file = fopen($string, 'w');
					fwrite($file, $this->query['values']);
					fclose($file);
				}else{
					throw new Exception('Put requires a string passed in the with method');
				}
				
				$this->add([
					'path' => $string,
					'text' => file_get_contents($string),
				]);
				
				$this->log['query'] .= $string; // Log path
			}
		}
		
		return $this->files;
	}
	
	
	protected function runDelete($app){
		
		// VALIDATE FILE //
		if($this->query['select']){
			foreach($this->query['select'] as $select){
				$path = [];
				$string = '';
				
				array_push($path, self::$config['root']);
				array_push($path, $this->query['folder']);
				array_push($path, $select);
				
				foreach($path as $shard) $string .= trim($shard, ' ').'/';
				$string = trim($string, '/');
				
				// File exists
				if($string = realpath($string)){
					if(unlink($string)){
						return true;
					}
				}
				
				$this->log['query'] .= $string; // Log path
			}
		}
		
		return false;
		
	}
	
	
}