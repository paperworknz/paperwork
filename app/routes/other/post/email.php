<?php

include '../app/app/bin/phpToPDF.php';

use Symfony\Component\Process\Process,
	Symfony\Component\HttpFoundation\Response;

$app->post('/post/email', 'uac', function() use ($app){
	/* Methods */
	
	/* Construction */
	$job_number		= $_POST['job_number'];
	$name			= $_POST['file_name'];
	$html			= $_POST['html'];
	$client_name	= $_POST['client_name'];
	$address		= $_POST['address'];
	$subject		= $_POST['subject'];
	$body			= $_POST['body'];
	
	
	// PDF //
	// Directory and file
	$easy = $app->user['easy'];
	
	if($_ENV['MODE'] == 'dev'){
		$dir = "../app/app/storage/clients/{$easy}/pdf/{$job_number}";
	}else{
		$dir = "/var/www/Dropbox/Paperwork/{$easy}/pdf/{$job_number}";
	}
	if(!file_exists($dir)) mkdir($dir, 0777); // Make directory for job_number if it doesn't exist
	$file = $job_number.'_'.$name.'.pdf'; // 1000_ . $_POST['file_name'] . .pdf=> "1000_1-quote.pdf"
	
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
	
	// Log event
	$app->event->log([
		'number' => 75,
		'title' => $app->user['username'].' created a PDF before sending an email',
		'text' => 'For job '.$job_number,
	]);
	
	
	
	// EMAIL //
	// Send Mail
	$mail = new PHPMailer;
	
	if($app->user['username'] == 'logan'){
		$meta = [
			'protocol' => 'TLS',
			'smtp' => 'smtp.gmail.com',
			'port' => '587',
			'from.name' => $app->user['first'].' '.$app->user['last'],
			'from.email' => 'logan@naileditconstruction.kiwi',
			'from.pw' => 'password5412',
			'to.name' => $client_name,
			'to.email' => $address,
			'attachment' => $dir.'/'.$file,
			'attachment.name' => $file,
		];
	}else if($app->user['username'] == 'admin'){
		$meta = [
			'protocol' => 'TLS',
			'smtp' => 'smtp.gmail.com',
			'port' => '587',
			'from.name' => $app->user['first'].' '.$app->user['last'],
			'from.email' => 'hello@paperwork.nz',
			'from.pw' => 'Dasistdank420',
			'to.name' => $client_name,
			'to.email' => $address,
			'attachment' => $dir.'/'.$file,
			'attachment.name' => $file,
		];
	}else{
		echo "Fail";
		die();
	}
	
	
	$mail->isSMTP();
	$mail->Host = $meta['smtp'];
	$mail->SMTPAuth = true;
	$mail->Username = $meta['from.email'];
	$mail->Password = $meta['from.pw'];
	
	if(isset($meta['protocol'])){
		$mail->SMTPSecure = $meta['protocol'];
	}
	$mail->Port = $meta['port'];
	
	$mail->setFrom($meta['from.email'], $meta['from.name']);
	$mail->addAddress($meta['to.email'], $meta['to.name']);
	$mail->addReplyTo($meta['from.email'], $meta['from.name']);
	$mail->addAttachment($meta['attachment'], $meta['attachment.name']);
	$mail->addBCC($meta['from.email']);
	
	$mail->isHTML(true);
	$mail->Subject = $subject;
	$mail->Body    = $body;
	$mail->AltBody = $body;
	
	if(!$mail->send()){
		echo 'Fail';
	}else{
		echo 'OK';
	}
	
});