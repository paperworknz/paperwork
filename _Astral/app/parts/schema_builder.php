<?php

class Schema_builder {
	
	protected $log;
	protected $routespath;
	protected $viewspath;
	
	public function __construct(Array $array){
		error_reporting(E_ERROR | E_PARSE);
		$this->viewspath = $array['views'];
		$this->routespath = $array['routes'];
	}
	
	public function run(){
		$path = '../_Astral/app/temp';
		
		################################################
		
		$file = '../app/app/resources/.schema';
		
		$new = fopen($file, 'w') or die("Can't open schema.php");
		fwrite($new, '<?php');
		fwrite($new, PHP_EOL);
		fwrite($new, 'return [');
		fwrite($new, PHP_EOL);
		
		###### Appending contents of patharray and filearray
		
		fwrite($new, file_get_contents($path.'/filearray.php'));
		fwrite($new, PHP_EOL);
		fwrite($new, file_get_contents($path.'/patharray.php'));
		fwrite($new, PHP_EOL);
		fwrite($new, '];');
		
		
		###### Close read, then kill page
		
		fclose($new);
		return 'Updated schema<br>';
	}
}