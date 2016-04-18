<?php

include '../app/app/bin/phpToPDF.php';

use Paperwork\Extended\Mail,
	Symfony\Component\Process\Process,
	Symfony\Component\HttpFoundation\Response;

$app->post('/post/pdf', 'uac', function() use ($app){
	/* Methods */
	
	/* Construction */
	$jobID	= $_POST['jobID'];
	$name	= $_POST['file_name'];
	$html	= $_POST['html'];
	
	// Directory and file
	$easy = $app->user['easy'];
	
	if($_ENV['MODE'] == 'dev'){
		$dir = "../app/app/storage/clients/{$easy}/pdf/{$jobID}";
	}else{
		$dir = "/var/www/Dropbox/Paperwork/{$easy}/pdf/{$jobID}";
	}
	if(!file_exists($dir)) mkdir($dir, 0777); // Make directory for jobID if it doesn't exist
	$file = $jobID.'_'.$name.'.pdf'; // 1000_ . $_POST['file_name'] . .pdf=> "1000_1-quote.pdf"
	
	// Create PDF
	phptopdf([
		'page_orientation'	=> 'portrait',
		'page_size'			=> 'A4',
		'margin'			=> ['right'=>'20','left'=>'20','top'=>'10','bottom'=>'10'],
		'source_type'		=> 'html',
		'source'			=> $html,
		'action'			=> 'save',
		'save_directory'	=> $dir,
		'file_name'			=> $file,
		'ssl'				=> 'yes'
	]);
	
	// DOWNLOAD
	$response = new Response(file_get_contents($dir.'/'.$file), 200, [
		'Content-Description' => 'File Transfer',
		'Content-Disposition' => 'attachment; filename="'.$file.'"',
		'Content-Transfer-Encoding'	=> 'binary',
		'Content-Type' => 'application/pdf'
	]);
	
	// Log event
	$app->event->log([
		'number' => 75,
		'title' => $app->user['username'].' created a PDF',
		'text' => 'For job '.$jobID,
		'uacID' => $app->user['uacID'],
	]);
	
	$response->send();
	
});