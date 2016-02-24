<?php

class Route_builder {
	
	protected $log;
	protected $viewspath;
	protected $routespath;
	protected $views;
	protected $routes;
	
	public function __construct(Array $array){
		error_reporting(E_ERROR | E_PARSE);
		$this->log = '';
		$this->viewspath = $array['views'].'/views';
		$this->routespath = $array['routes'].'/routes';
	}
	
	public function crawlViews($path){
		$views	= [];
		
		foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path)) as $filename => $file) {
			if(!strpos($file, '_')){
				$file = str_replace('\\', '/', $file);
				$file = str_replace('/..', '/', $file);
				$file = str_replace('/.', '/', $file);
				$file = str_replace($path, '', $file);
				if(substr($file, -1) != '/'){
					$file = str_replace('.html', '', $file);
					$views[$file] = $path.$file.'.html';
				}
			}
		}
		
		$this->views = $views;
	}
	
	public function crawlRoutes($path){
		$routes	= [];
		
		foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path)) as $filename => $file) {
			if(!strpos($file, '_')){
				$file = str_replace('\\', '/', $file);
				$file = str_replace('/..', '/', $file);
				$file = str_replace('/.', '/', $file);
				$file = str_replace($path, '', $file);
				if(substr($file, -1) != '/'){
					$file = str_replace('.php', '', $file);
					$routes[$file] = $path.$file.'.html';
				}
			}
		}
		
		$this->routes = $routes;
	}
	
	public function update(){
		$this->crawlViews($this->viewspath);
		$this->crawlRoutes($this->routespath);
	}
	
	public function check(){
		foreach($this->views as $key => $pair){
			if(!array_key_exists($key, $this->routes)){
				// We've found a new html file that doesn't have a route!
				$this->createRoute($key);
			}
		}
	}
	
	public function createRoute($key){
		$file = substr(strrchr($key, '/'), 1);
		$path = rtrim($key, '/');
		
		$temp = explode('/', $path);
		array_pop($temp);
		
		$routepath = $path;
		$viewpath = implode('/', $temp);
		
		if(!file_exists($this->routespath.$viewpath.'.php')){
			mkdir($this->routespath.$viewpath, 0777, true);
		}
		
		$new = fopen($this->routespath.$viewpath.'/'.$file.'.php', 'w');
		fwrite($new, '<?php');
		fwrite($new, PHP_EOL);
		fwrite($new, PHP_EOL);
		fwrite($new, '$app->get('."'".$routepath."', 'uac', function() use (".'$app){');
		fwrite($new, PHP_EOL);
		fwrite($new, "\t".'/* Methods */');
		fwrite($new, PHP_EOL);
		fwrite($new, PHP_EOL);
		fwrite($new, "\t".'/* Construction */');
		fwrite($new, PHP_EOL);
		fwrite($new, "\t".'$app->build->page('."'views".$viewpath.'/'.$file.".html');");
		fwrite($new, PHP_EOL);
		fwrite($new, '});');
		fclose($new);
		$this->log .= 'Created a route for '.$file.'<br>';
	}
	
	public function run(){
		$this->update();
		$this->check();
		if($this->log == ''){
			return 'No new routes<br>';
		}else{
			return $this->log;
		}
	}
	
}