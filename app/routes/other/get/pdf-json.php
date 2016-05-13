<?php

$app->get('/get/pdf-json/:a', 'uac', function($a) use($app){
	/* Methods */
	
	/* Construction */
	$easy = $app->user['easy'];
	
	if($_ENV['MODE'] == 'dev'){
		$path = "../app/app/storage/clients/{$easy}/pdf/{$a}";
	}elseif($_ENV['MODE'] == 'prod'){
		$path = "/var/www/Dropbox/Paperwork/{$easy}/pdf/{$a}";
	}
	
	$pdfs = [];
	
	if(file_exists($path)){
		foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path)) as $filename => $file) {
			$file = str_replace('\\', '/', $file);
			$file = str_replace('/..', '/', $file);
			$file = str_replace('/.', '/', $file);
			$file = str_replace($path, '', $file);
			$file = str_replace('/', '', $file);
			if($file != ''){
				$pdfs[] = $file;
			}
		}
		
		echo count($pdfs) > 0 ? $app->parse->arrayToJson($pdfs) : 0;
	}else{
		echo '0';
	}
});