<?php

$app->post('/post/cancel', 'uac', function() use ($app){
	/* Methods */
	$mail = new PHPMailer;
	
	/* Construction */
	
	// Get Braintree user
	$user = Braintree_Customer::find($app->user['id']);
	
	// Remove payment methods (and therefore subscriptions)
	foreach($user->paymentMethods as $method){
		Braintree_PaymentMethod::delete($method->token);
	}
	
	// Demote user
	$app->sql->put('user')->with([
		'privilege' => 'baby',
	])->where('id', '=', $app->user['id'])->root()->run();
	
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
	$mail->addAddress($app->user['email'], $app->user['first'].' '.$app->user['last']);
	$mail->addReplyTo($root['address'], 'Paperwork');
	
	$mail->isHTML(true);
	$mail->Subject = 'Paperwork Account Cancellation';
	$mail->Body = "<div>Hey ".$app->user['first']."</div>
	<div><br></div>
	<div>This is an acknowledgement of your Paperwork account being successfully canceled. You will no longer be billed, your payment information has been removed, 
	and your account now behaves as a trial user.</div>
	<div><br></div>
	<div>We wish you nothing but the best for your future endeavours!</div>
	<div><br></div>
	<div>Cheers</div>";
	
	$mail->AltBody = "This is an acknowledgement of your Paperwork account being successfully canceled. You will no longer be billed, your payment information has been removed, 
	and your account now behaves as a trial user. We wish you nothing but the best for your future endeavours! Cheers";
	
	$response = $mail->send();
	
	$app->event->log('cancelled their subscription, account demoted to baby');
	
	echo $app->build->success([
		'message' => 'Client subscription removed'
	]);
});