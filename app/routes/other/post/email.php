<?php

$app->post('/post/email', 'uac', function() use ($app){
	
	/* Methods */
	$mail = new PHPMailer;
	$address = isset($_POST['address']) ? $_POST['address'] : false;
	$subject = isset($_POST['subject']) ? $_POST['subject'] : false;
	$password = isset($_POST['password']) ? $_POST['password'] : false;
	$body = isset($_POST['body']) ? $_POST['body'] : false;
	
	/* Construction */
	
	$email = $app->sql->get('user_email')->one();
	$client = $app->sql->get('client')->select('name')->where('email', '=', $address)->one();
	
	if($subject == 'true') $subject = '';
	if($body == 'true') $body = "<div><br></div>";
	
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
	// $mail->addAttachment($request['attachment'], $request['attachment.name']);
	// $mail->addBCC($request['from.email']);
	
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