<?php

class Html_path_builder {
	
	protected $log;
	protected $routespath;
	protected $viewspath;
	
	public function __construct(Array $array){
		error_reporting(E_ERROR | E_PARSE);
		$this->viewspath = $array['views'];
		$this->routespath = $array['routes'];
	}
	
	public function crawl($path){
		$patharray = [];
		
		foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path.'/other/inc/html')) as $filename => $file) {
			$file = str_replace($path, '', $file);
			$file = str_replace('\\', '/', $file);
			$file = str_replace('/..', '/', $file);
			$file = str_replace('/.', '/', $file);
			if(substr($file, -1) != '/'){
				$name = str_replace('.html', '', $file);
				$name = str_replace('/other/inc/html/', '', $name);
				$name = str_replace('-', '', $name);
				if(!strpos($name, '/')){
					$patharray[$name] = $file;
				}
			}
		}
		
		foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path.'/other/inc')) as $filename => $file) {
			$file = str_replace($path, '', $file);
			$file = str_replace('\\', '/', $file);
			$file = str_replace('/..', '/', $file);
			$file = str_replace('/.', '/', $file);
			if(substr($file, -1) != '/'){
				$name = str_replace('.html', '', $file);
				$name = str_replace('/other/inc/', '', $name);
				$name = str_replace('-', '', $name);
				if(!strpos($name, '/')){
					$patharray[$name] = $file;
				}
			}
		}
		
		$fp = fopen('../_Astral/app/temp/patharray.php', 'w');
		fwrite($fp, "'patharray' => [".PHP_EOL);
		foreach($patharray as $key => $pair){
			fwrite($fp, "'".$key."' => '".$pair."',".PHP_EOL);
		}
		fwrite($fp, '],');
		fclose($fp);
	}
	
	public function run(){
		$this->crawl($this->viewspath);
		return 'Updated html path array<br>';
	}
	
}