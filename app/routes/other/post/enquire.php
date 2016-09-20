<?php

$app->post('/post/enquire', 'app', function() use ($app){
	/* Methods */
	$mail = new PHPMailer;
	
	/* Construction */
	$email = isset($_POST['email']) ? filter_var($_POST['email'], FILTER_VALIDATE_EMAIL) : false;
	$name = isset($_POST['name']) ? $_POST['name'] : false;
	$body = isset($_POST['body']) ? $_POST['body'] : false;
	
	if(!$email){
		$app->flash('error', "We can't send an email there... Please enter a real email address!");
		$app->redirect($app->root);
	}
	
	$date = date("d/m/Y H:i:s");
	
	// Email with recovery string
	$root = $app->sql->get('user_email')->where('address', '=', 'hello@paperwork.nz')->and('user_id', '=', '1')->root()->one();
	
	$mail->isSMTP();
	$mail->SMTPAuth = true;
	$mail->Host = $root['smtp'];
	$mail->Port = $root['port'];
	$mail->SMTPSecure = $root['protocol'];
	
	$mail->Username = $root['address'];
	$mail->Password = $_ENV['EMAIL_PASSWORD'];
	
	$mail->setFrom($root['address'], 'Paperwork');
	$mail->addAddress($root['address'], 'Paperwork');
	$mail->addReplyTo($root['address'], 'Paperwork');
	
	$mail->isHTML(true);
	$mail->Subject = "Paperwork Enquiry from {$name}";
	$mail->Body = 
	"<div>{$date}</div>
	<div><b>Name:</b> {$name}</div>
	<div><b>Email:</b> {$email}</div>
	<div><b>Body:</b> {$body}</div>";
	
	$response = $mail->send();
	
	if(!$response) {
		$app->flash('error', "We're very sorry but we couldn't send that - please email us at <b>hello@paperwork.nz</b>!");
		$app->redirect($app->root);
	}
	
	$app->event->log([
		'text' => "Enquiry from {$name}",
	]);
	$app->flash('success', "We received your enquiry, we'll be in touch soon!");
	$app->redirect($app->root);
});