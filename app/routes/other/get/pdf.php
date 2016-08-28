<?php

use Paperwork\Extended\Document,
	Symfony\Component\Process\Process,
	Symfony\Component\HttpFoundation\Response;


$app->get('/get/pdf/:a/:b', 'uac', function($a, $b) use ($app){
	/* Methods */
	
	/* Construction */
	$id = $app->user['id'];
	
	$view = 'inline';
	
	if(isset($_GET['view'])){
		if($_GET['view'] == 'attachment'){
			$view = 'attachment';
		}
	}
	
	if($_ENV['MODE'] == 'dev'){
		$path = "../app/app/storage/clients/{$id}/pdf/{$a}/{$b}";
	}elseif($_ENV['MODE'] == 'prod'){
		$path = "/var/www/Dropbox/Paperwork/{$id}/pdf/{$a}/{$b}";
	}
	
	if(!file_exists($path)){
		$app->flash('error', 'Sorry, we couldn\'t find that PDF.');
		$app->redirect("{$app->root}/job/{$a}");
	}
	
	$response = new Response(file_get_contents($path), 200, [
		'Content-Description'	=> 'File Transfer',
		'Content-Disposition'	=> "$view; filename='{$b}'",
		'Content-Transfer-Encoding' => 'binary',
		'Content-Type'	=> 'application/pdf'
	]);
	
	$response->send(); // Return to client
});