<?php

include '../app/app/bin/phpToPDF.php';

use Symfony\Component\Process\Process,
	Symfony\Component\HttpFoundation\Response;

$app->post('/post/email', 'uac', function() use ($app){
	/* Methods */
	
	/* Construction */
	$job_number		= $_POST['job_number'];
	$name			= $_POST['name'];
	$html			= $_POST['html'];
	$client_name	= $_POST['client_name'];
	$address		= $_POST['address'];
	$subject		= $_POST['subject'];
	$body			= $_POST['body'];
	$password		= $_POST['password'];
	
	
	// Directory and file
	$easy = $app->user['easy'];
	
	if($_ENV['MODE'] == 'dev'){
		$dir = "../app/app/storage/clients/{$easy}/pdf/{$job_number}";
	}else{
		$dir = "/var/www/Dropbox/Paperwork/{$easy}/pdf/{$job_number}";
	}
	
	if(!file_exists($dir)) mkdir($dir, 0777); // Make directory for job_number if it doesn't exist
	
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
	
	$app->event->log('created PDF '.$file);
	
	
	// EMAIL //
	// Send Mail
	$mail = new PHPMailer;
	
	// User email settings
	if($email = $app->sql->get('user_email_settings')->one()){
		// Password verify
		if(password_verify($password, $email['password'])){
			$meta = [
				'protocol' => $email['protocol'],
				'smtp' => $email['smtp'],
				'port' => $email['port'],
				'from.name' => $app->user['first'].' '.$app->user['last'],
				'from.email' => $email['address'],
				'from.pw' => $password,
				'to.name' => $client_name,
				'to.email' => $address,
				'attachment' => $dir.'/'.$file,
				'attachment.name' => $file,
			];
			
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
			//$mail->addBCC($meta['from.email']);
			
			$mail->isHTML(true);
			$mail->Subject = $subject;
			$mail->Body    = $body;
			$mail->AltBody = $body;
			
			if($mail->send()){
				$app->event->log('sent an email to '.$meta['to.email'].', with subject: '.$subject);
				echo 'OK';
				die();
			}
		}else{
			echo 'Password';
			die();
		}
	}
	
	echo 'Fail';
	
});