<?php

include '../app/app/bin/phpToPDF.php';

use Symfony\Component\Process\Process,
	Symfony\Component\HttpFoundation\Response;

$app->post('/post/pdf', 'uac', function() use ($app){
	/* Methods */
	
	/* Construction */
	$job_number = $_POST['job_number'];
	$name = $_POST['name'];
	$html = $_POST['html'];
	
	// Directory and file
	$id = $app->user['id'];
	
	if($_ENV['MODE'] == 'dev'){
		$dir = "../app/app/storage/clients/{$id}/pdf/{$job_number}";
	}else{
		$dir = "/var/www/Dropbox/Paperwork/{$id}/pdf/{$job_number}";
	}
	
	if(!file_exists($dir)) mkdir($dir, 0775); // Make directory for job_number if it doesn't exist
	
	$file = "{$name}.pdf"; // File name
	
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
	$response = new Response(file_get_contents("{$dir}/{$file}"), 200, [
		'Content-Description' => 'File Transfer',
		'Content-Disposition' => 'attachment; filename="'.$file.'"',
		'Content-Transfer-Encoding'	=> 'binary',
		'Content-Type' => 'application/pdf'
	]);
	
	$app->event->log([
		'text' => "created a PDF for job_number: {$job_number}",
		'icon' => 'pdf.png',
	]);
	
	$response->send();
	
});