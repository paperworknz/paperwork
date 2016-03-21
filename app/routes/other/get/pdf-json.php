<?php

$app->get('/get/pdf-json/:a', 'uac', function($a) use($app){
	/* Methods */
	
	/* Construction */
	$easy = $app->user['easy'];
	$path = "/var/www/Dropbox/Paperwork/{$easy}/pdf/{$a}";
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
		
		echo strlen($app->parse->arrayToJson($pdfs)) > 0 ? $app->parse->arrayToJson($pdfs) : 0;
	}else{
		echo '0';
	}
});