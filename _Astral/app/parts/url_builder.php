<?php

class Url_builder {
	
	protected $log;
	protected $routespath;
	protected $viewspath;
	
	public function __construct(Array $array){
		error_reporting(E_ERROR | E_PARSE);
		$this->viewspath = $array['views'];
		$this->routespath = $array['routes'];
	}
	
	public function crawl($path){
		foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path.'/other')) as $filename => $file) {
			if(!strpos($file, '_')){
				$file = str_replace('\\', '/', $file);
				$file = str_replace('/..', '/', $file);
				$file = str_replace('/.', '/', $file);
				$file = str_replace($path.'/other', '', $file);
				if(substr($file, -1) != '/'){
					$file = str_replace('.php', '', $file);
					$filearray[$file] = $path.'/other'.$file.'.php';
					
				}
			}
		}
		
		foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path.'/routes')) as $filename => $file) {
			if(!strpos($file, '_')){
				$file = str_replace('\\', '/', $file);
				$file = str_replace('/..', '/', $file);
				$file = str_replace('/.', '/', $file);
				$file = str_replace($path.'/routes', '', $file);
				if(substr($file, -1) != '/'){
					$file = str_replace('.php', '', $file);
					$filearray[$file] = $path.'/routes'.$file.'.php';
				}
			}
		}
		
		$fp = fopen('../_Astral/app/temp/filearray.php', 'w');
		fwrite($fp, "'filearray' => [".PHP_EOL);
		foreach($filearray as $key => $pair){
			fwrite($fp, "'".$key."' => '".$pair."',".PHP_EOL);
		}
		fwrite($fp, '],');
		fclose($fp);
	}
	
	public function run(){
		$this->crawl($this->routespath);
		return 'Updated URL array<br>';
	}
	
}