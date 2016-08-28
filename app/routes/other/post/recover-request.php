<?php

$app->post('/post/recover-request', 'app', function() use ($app){
	/* Methods */
	$email = isset($_POST['email']) ? $_POST['email'] : false;
	$mail = new PHPMailer;
	
	/* Construction */
	if(!$email){
		$app->flash('error', 'Please provide an email address');
		$app->redirect($app->root.'/recover-account');
	}
	
	$user = $app->sql->get('user')->where('email', '=', $email)->root()->one();
	
	if(!$user){
		$app->flash('error', "Sorry, we could not find {$email}");
		$app->redirect($app->root.'/recover-account');
	}
	
	// Create recovery string
	$recover = bin2hex(random_bytes(32));
	
	$app->sql->put('user')->with([
		'recover' => $recover
	])->where('email', '=', $email)->root()->run();
	
	// Email with recovery string
	$root = $app->sql->get('user_email')->where('address', '=', 'hello@paperwork.nz')->and('user_id', '=', '1')->root()->one();
	
	$mail->isSMTP();
	$mail->SMTPAuth = true;
	$mail->Host = $root['smtp'];
	$mail->Port = $root['port'];
	$mail->SMTPSecure = $root['protocol'];
	
	$mail->Username = $root['address'];
	$mail->Password = $_ENV['EMAIL_PASSWORD'];
	
	$mail->setFrom($root['address'], 'Account Recovery');
	$mail->addAddress($email, $user['first'].' '.$user['last']);
	$mail->addReplyTo($root['address'], 'Account Recovery');
	
	$mail->isHTML(true);
	$mail->Subject = 'Paperwork Account Recovery';
	$mail->Body = "<div>Hey ".$user['first']."</div>
	<div><br></div>
	<div>You have attempted to recover your Paperwork account. 
	If this was not you, you can safely ignore this message.</div>
	<div><br></div>
	<div>Please click <a href=\"{$app->root}/get/recover?email={$email}&id={$recover}\">this link</a> to complete your account recovery.</div>
	<div><br></div>
	<div>All the best!</div>";
	
	$mail->AltBody = "Please go to {$app->root}/get/recover?email={$email}&id={$recover} to complete your account recovery.";
	
	$response = $mail->send();
	
	if(!$response) {
		$app->flash('error', "We're very sorry, there seems to be a problem with our recovery service. Please email us at hello@paperwork.nz!");
		$app->redirect($app->root.'/recover-account');
	}
	
	$app->flash('success', "We have sent you a recovery email. Please click the link in our email to complete your account recovery.");
	$app->redirect($app->root.'/recover-account');
});