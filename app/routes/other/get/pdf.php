<?php

use Paperwork\Extended\Form,
	Symfony\Component\Process\Process,
	Symfony\Component\HttpFoundation\Response;


$app->get('/get/pdf/:a/:b', 'uac', function($a, $b) use ($app){
	/* Methods */
	
	/* Construction */
	$path = $app->services['client_storage'].'/'.$app->user['easy'].'/pdf/'.$a;
	$total = $path.'/'.$b;
	if(file_exists($total)){
		// DOWNLOAD //
		$response = new Response(file_get_contents($total), 200, [
			'Content-Description'	=> 'File Transfer',
			'Content-Disposition'	=> 'inline; filename="'.$b.'"',
			'Content-Transfer-Encoding' => 'binary',
			'Content-Type'	=> 'application/pdf'
		]);
		$response->send(); // Return to client
	}else{
		$app->event->log([
			'title' => $app->user['username'].' requested a missing PDF',
			'text' => 'URI: '.$app->request->getResourceUri(),
			'number' => 77,
			'level' => 'Warning',
			'uacID' => $app->user['uacID'],
		]);
		$app->flash('error', 'Sorry, we couldn\'t find that PDF.');
		$app->redirect($app->root.'/job/'.$a);
	}
	
});

$app->get('/get/test/:a/:b', 'uac', function($a, $b) use ($app){
	/* Methods */
	
	/* Construction */
	$easy = $app->user['easy'];
	$total = "/var/www/Dropbox/Paperwork/{$easy}/PDF/{$a}/{$b}";
	if(file_exists($total)){
		// DOWNLOAD //
		$response = new Response(file_get_contents($total), 200, [
			'Content-Description'	=> 'File Transfer',
			'Content-Disposition'	=> 'inline; filename="'.$b.'"',
			'Content-Transfer-Encoding' => 'binary',
			'Content-Type'	=> 'application/pdf'
		]);
		$response->send(); // Return to client
	}else{
		$app->event->log([
			'title' => $app->user['username'].' requested a missing PDF',
			'text' => 'URI: '.$app->request->getResourceUri(),
			'number' => 77,
			'level' => 'Warning',
			'uacID' => $app->user['uacID'],
		]);
		$app->flash('error', 'Sorry, we couldn\'t find that PDF.');
		$app->redirect($app->root.'/job/'.$a);
	}
	
}); //