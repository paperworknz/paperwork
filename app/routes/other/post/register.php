<?php

use GuzzleHttp\Client;

$app->post('/post/register', 'app', function() use ($app){
	/* Methods */
	$client = new Client([
		'base_uri' => 'https://paperwork.api-us1.com/admin/api.php',
		'verify' => false,
	]);
	
	/* Construction */
	if($_POST['first'] &&  $_POST['last'] &&  $_POST['username'] &&  $_POST['company'] &&  $_POST['email'] &&  $_POST['password']){
		
		$first = filter_var($_POST['first'], FILTER_SANITIZE_STRING);
		$last = filter_var($_POST['last'], FILTER_SANITIZE_STRING);
		$company = filter_var($_POST['company'], FILTER_SANITIZE_STRING);
		$username = filter_var($_POST['username'], FILTER_SANITIZE_STRING);
		$password = filter_var($_POST['password'], FILTER_SANITIZE_STRING);
		$confirm = filter_var($_POST['confirm'], FILTER_SANITIZE_STRING);
		$email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
		
		$action = $app->auth->register([
			'first' => $first,
			'last' => $last,
			'company' => $company,
			'username' => $username,
			'password' => $password,
			'confirm' => $confirm,
			'email' => $email,
			'privilege' => 'user',
		]);
		
		
		switch($action){
			case 'Email Exists':
				echo $app->build->error('<b>'.$email.'</b> is already registered.<br>Please contact support if you can\'t access your account.');
				break;
			case 'Username Exists':
				echo $app->build->error('Sorry, the username <b>'.$username.'</b> is taken!<br>Please try something else.');
				break;
			case 'Password Mismatch':
				echo $app->build->error('Sorry, the passwords your entered did not match.');
				break;
			case 'Registered Successfully':
				
				// ActiveCampaign add contact
				$params = [
					'api_key' => '117903f749dc1fd8d6f6d317c10e22bb4d7deadf085c2920826dd197177055f6bf35b891',
					'api_action' => 'contact_add',
					'api_output' => 'json',
				];
				
				$query = '?';
				foreach($params as $key => $value) $query .= $key.'='.urlencode($value).'&';
				$query = rtrim($query, '& ');
				
				$post = [
					'email' => $email,
					'first_name' => $first,
					'last_name' => $last,
					'orgname' => $company,
				];
				
				// Send API request
				$response = $client->request('POST', $query, [
					'form_params' => $post
				]);
				
				$body = $response->getBody();
				$json = (string) $body;
				$result = $app->parse->jsonToArray($json);
				
				if($result['result_code'] != 1) $app->event->log('ActiveCampaign error: '.$result['result_code'].PHP_EOL.'Message: '.$result['result_message']);
				
				echo $app->build->success([
					'message' => 'Registered Successfully'
				]);
				break;
		}
		
	}else{
		$app->flash('error', 'Please fill out all of the fields!');
		$app->redirect($app->root);
	}
});