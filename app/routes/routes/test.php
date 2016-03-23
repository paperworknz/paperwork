<?php

$app->get('/test', 'uac', function() use ($app){
	/* Methods */
	$backup = new \Paperwork\Extended\SQLBackup;
	
	/* Construction */
	$files = [];
		
	foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator('/var/www/Dropbox/Paperwork/NailedItConstruc/sql/')) as $filename => $file) {
		$file = str_replace($this->path, '', $file);
		$file = str_replace('\\', '/', $file);
		$file = str_replace('/..', '/', $file);
		$file = str_replace('/.', '/', $file);
		if(substr($file, -1) != '/'){
			$file = str_replace($this->path, '', $file);
			$files[] = $file;
		}
	}
	
	$bytes = 0;
	foreach(new RecursiveIteratorIterator(new RecursiveDirectoryIterator($this->path, FilesystemIterator::SKIP_DOTS)) as $object){
		$bytes += filesize($object);
	}
	
	if($bytes > $this->upper){
		unlink($this->path.reset($files));
	}
}); 