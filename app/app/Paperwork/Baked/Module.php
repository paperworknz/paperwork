<?php

namespace Paperwork\Baked;

class Module {
	
	public $modules = [];
	public $module_dir = '../app/routes/other/_module/';
	private $privilege = [
		'admin' => 0,
		'user' => 1,
		'guest' => 1,
		'trial' => 1,
	];
	
	public function add($name, $privilege, $fn){
		
		if(!isset($this->privilege[$privilege])){
			throw new \Exception("Invalid privilege level: {$privilege}");
		}
		
		$this->modules[$name] = [
			'privilege' => $this->privilege[$privilege],
			'run' => $fn,
		];
	}
	
	public function evaluate($name, $data){
		$app = \Slim\Slim::getInstance();
		
		$self = $this->privilege[$app->user['privilege']];
		
		if($self > $this->modules[$name]['privilege']){
			return false;
		}
		
		return $this->modules[$name]['run']($data);
	}
	
	public function require($name, $data = []){
		$app = \Slim\Slim::getInstance();
		
		$file = "{$this->module_dir}/{$name}.php";
		
		// Require module
		if(!file_exists($file)) return [];
		require $file;
		
		// Evaluate module
		return $this->evaluate($name, $data);
	}
	
}