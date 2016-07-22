<?php

namespace Paperwork\Baked;

class Module {
	
	public $modules = [];
	public $module_dir = '../app/routes/other/_module/';
	
	public function add($name, $fn){
		$this->modules[$name] = $fn;
	}
	
	public function evaluate($name, $data){
		return $this->modules[$name]($data);
	}
	
	public function require($name, $data = []){
		$app = \Slim\Slim::getInstance();
		
		$file = "$this->module_dir/$name.php";
		
		// Require module
		file_exists($file) ? require $file : null;
		
		// Evaluate module
		return $this->evaluate($name, $data);
	}
	
}