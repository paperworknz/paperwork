<?php

namespace Paperwork\Extended;

class Mail {
	
	public function __construct(){
		require_once '../app/app/bin/PHPMailer-master/PHPMailer-master/PHPMailerAutoload.php';
	}
	
	public function send($arr){
		$mail = new \PHPMailer;
		
		$mail->isSMTP();
		$mail->Host = $arr['smtp'];
		$mail->SMTPAuth = true;
		$mail->Username = $arr['from.email'];
		$mail->Password = $arr['from.pw'];
		
		if(isset($arr['protocol'])){
			$mail->SMTPSecure = $arr['protocol'];
		}
		$mail->Port = $arr['port'];
		
		$mail->setFrom($arr['from.email'], $arr['from.name']);
		$mail->addAddress($arr['to.email'], $arr['to.name']);
		$mail->addReplyTo($arr['from.email'], $arr['from.name']);
		$mail->addAttachment($arr['attachment'], $arr['attachment.name']);
		$mail->addBCC($arr['from.email']);
		
		$mail->isHTML(true);
		$mail->Subject = $arr['subject'];
		$mail->Body    = $arr['body'];
		$mail->AltBody = $arr['body'];
		
		if(!$mail->send()) {
			echo 'Message could not be sent.';
			echo 'Mailer Error: ' . $mail->ErrorInfo;
		} else {
			echo 'Message has been sent';
		}
	}
}