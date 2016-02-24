<?php

class Astral {
	
	protected $result;
	protected $log;
	
	public function run(Array $data){
		foreach($data as $datum){
			# Path
			$path = '../_Astral/app/parts/'.$datum.'.php';
			
			# Load the class
			include $path;
			
			# Find the class name
			$file = file_get_contents($path);
			$file = explode('class', $file);
			$file = explode('{', $file[1]);
			$file = str_replace(' ', '', $file[0]); // Class name
			
			# Instantiate class
			$instance = new $file([
				'views' => '../app/views',
				'routes' => '../app/routes'
			]);
			echo $instance->run();
		}
		$files = glob('../_Astral/app/temp/*');
		foreach($files as $file){
			if(is_file($file)){
				unlink($file);
			}
		}
		echo 'Cleared temp files<br>';
	}
}