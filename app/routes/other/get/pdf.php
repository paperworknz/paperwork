<?php

use Paperwork\Extended\Form,
	Symfony\Component\Process\Process,
	Symfony\Component\HttpFoundation\Response;


$app->get('/get/pdf/:a/:b', 'uac', function($a, $b) use ($app){
	/* Methods */
	
	/* Construction */
	$id = $app->user['id'];
	
	if($_ENV['MODE'] == 'dev'){
		$path = "../app/app/storage/clients/{$id}/pdf/{$a}/{$b}";
	}elseif($_ENV['MODE'] == 'prod'){
		$path = "/var/www/Dropbox/Paperwork/{$id}/pdf/{$a}/{$b}";
	}
	
	if(file_exists($path)){
		// Log event
		$app->event->log([
			'text' => "looked at PDF: {$b}",
			'icon' => 'pdf.png',
		]);
		
		// DOWNLOAD //
		$response = new Response(file_get_contents($path), 200, [
			'Content-Description'	=> 'File Transfer',
			'Content-Disposition'	=> "inline; filename='{$b}'",
			'Content-Transfer-Encoding' => 'binary',
			'Content-Type'	=> 'application/pdf'
		]);
		$response->send(); // Return to client
	}else{
		$app->event->log([
			'icon' => 'pdf.png',
			'title' => "opened a missing PDF. URI: {$app->request->getResourceUri()}",
		]);
		$app->flash('error', 'Sorry, we couldn\'t find that PDF.');
		$app->redirect("{$app->root}/job/{$a}");
	}
	
});