<?php

$app->post('/post/email', 'uac', function() use ($app){
	
	/* Methods */
	$mail = new PHPMailer;
	$address = isset($_POST['address']) ? $_POST['address'] : false;
	$cc = isset($_POST['cc']) ? $_POST['cc'] : false;
	$bcc = isset($_POST['bcc']) ? $_POST['bcc'] : false;
	$subject = isset($_POST['subject']) ? $_POST['subject'] : false;
	$password = isset($_POST['password']) ? $_POST['password'] : false;
	$body = isset($_POST['body']) ? $_POST['body'] : false;
	$attachments = isset($_POST['attachments']) ? $_POST['attachments'] : [];
	
	/* Construction */
	
	$email = $app->sql->get('user_email')->one();
	$client = $app->sql->get('client')->select('name')->where('email', '=', $address)->one();
	
	// Validation, normalisation of data
	if($subject == 'true') $subject = '';
	if($body == 'true') $body = "<div><br></div>";
	if(filter_var($address, FILTER_VALIDATE_EMAIL) === false) die($app->build->error('Please enter a valid email address'));
	if($cc && filter_var($cc, FILTER_VALIDATE_EMAIL) === false) die($app->build->error('Please enter a valid CC email address'));
	if($bcc && filter_var($bcc, FILTER_VALIDATE_EMAIL) === false) die($app->build->error('Please enter a valid BCC email address'));
	if(!$email) die($app->build->error('You have not entered your email settings in the Settings page'));
	
	$request = [
		'protocol' => $email['protocol'],
		'smtp' => $email['smtp'],
		'port' => $email['port'],
		'from.name' => $app->user['first'].' '.$app->user['last'],
		'from.email' => $email['address'],
		'from.pw' => $password,
		'to.email' => $address,
		'to.name' => $client ?: $address,
		'cc.email' => $cc,
		'bcc.email' => $bcc,
	];
	
	$mail->isSMTP();
	$mail->SMTPAuth = true;
	$mail->Host = $request['smtp'];
	$mail->Port = $request['port'];
	
	if(isset($request['protocol'])) $mail->SMTPSecure = $request['protocol'];
	
	$mail->Username = $request['from.email'];
	$mail->Password = $request['from.pw'];
	
	$mail->setFrom($request['from.email'], $request['from.name']);
	$mail->addAddress($request['to.email'], $request['to.name']);
	$mail->addReplyTo($request['from.email'], $request['from.name']);
	
	// Attach attachments if they exist in /$storage/$id/
	foreach($attachments as $key => $value){
		$value = str_replace("$app->root/get", '', $value);
		$value = $_ENV['STORAGE'].'/'.$app->user['id'].$value;
		
		if(!file_exists($value)) continue;
		
		$mail->addAttachment($value, $key);
	}
	
	if($cc) $mail->addCC($cc);
	if($bcc) $mail->addBCC($bcc);
	
	$mail->isHTML(true);
	$mail->Subject = $subject;
	$mail->Body    = $body;
	$mail->AltBody = $body;
	
	$response = $mail->send();
	
	if(!$response) {
		die($app->build->error("Your email settings failed to deliver the email. Please make sure they are correct."));
	}
	
	echo $app->build->success([
		'message' => 'Email Sent Successfully',
	]);
});