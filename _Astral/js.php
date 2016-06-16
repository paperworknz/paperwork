<?php

ini_set('display_errors', 'on');

class Js {
	
	private function crawl($core){
		
		$item = explode('\\', $core);
		$name = array_pop($item);
		$path = implode('\\', $item).'\\';
		
		$core = $path.$name;
		
		$js = file_get_contents($core);
		
		if(strpos($js, '//->')){
			$shards = preg_split("/\r\n|\n|\r/", $js);
			
			foreach($shards as $index => $shard){
				if(strpos(trim($shard), '//->') !== false){
					$shard = str_replace('//->', '', $shard);
					$shard = trim($shard);
					
					if(file_exists($path.$shard)){
						$shard = file_get_contents($path.$shard);
						$shards[$index] = $shard;
					}
				}
			}
			
			// Join array into a string
			$file = implode("\n", $shards);
		}else{
			$file = $js;
		}
		
		// Make _Astral folder if it doesn't exist
		$_Astral = $path.'_Astral';
		if(!file_exists($_Astral)) mkdir($_Astral, 0777);
		
		// Astral name, to avoid possible file overwrite
		$name_astral = str_replace('.', '.astral.', $name);
		
		// Path to Astral output
		$_Astralpath = $_Astral.'\\'.$name_astral;
		
		$min = fopen($_Astralpath, 'w');
		fwrite($min, $file);
		fclose($min);
		
		return $_Astralpath;
	}
	
	public function run($core){
		echo $this->crawl($core);
		return;
	}
}

$parse = new Js;
if(isset($argv[1])){
	$parse->run($argv[1]);
}else{
	$parse->run('C:\\Bitnami\\wampstack-7.0.0-0\\apache2\\htdocs\\paperwork\\app\\views\\other\\js\\services\\Notification\\Notification.js');
}