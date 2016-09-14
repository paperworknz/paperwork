<?php

use GuzzleHttp\Client;

$app->post('/post/register', 'app', function() use ($app){
	/* Methods */
	$client = new Client([
		'base_uri' => 'https://paperwork.api-us1.com/admin/api.php',
		'verify' => false,
	]);
	
	// ActiveCampaign query parameter
	$params = [
		'api_key' => '117903f749dc1fd8d6f6d317c10e22bb4d7deadf085c2920826dd197177055f6bf35b891',
		'api_action' => 'contact_add',
		'api_output' => 'json',
	];
	
	// Formatted
	$query = '?';
	foreach($params as $key => $value) $query .= $key.'='.urlencode($value).'&';
	$query = rtrim($query, '& ');
	
	$email = isset($_POST['email']) ? filter_var($_POST['email'], FILTER_VALIDATE_EMAIL) : false;
	$password = isset($_POST['password']) ? $_POST['password'] : false;
	$confirm = isset($_POST['confirm']) ? $_POST['confirm'] : false;
	
	/* Construction */
	if(!$email) die($app->build->error('Please enter a valid email address!'));
	if(!$password) die($app->build->error('Please enter a password!'));
	if(!$confirm) die($app->build->error('Please confirm your password!'));
	
	$action = $app->auth->register([
		'email' => $email,
		'password' => $password,
		'confirm' => $confirm,
		'privilege' => 'trial',
	]);
	
	if(!$action['success']) die($app->build->error($action['message']));
	
	// Post registration
	$user_id = $action['id'];
	
	// Add user to Braintree
	$result = Braintree_Customer::create([
		'id' => $user_id,
		'email' => $email,
	]);
	
	// Log and end on error
	if(!$result->success){
		$app->event->log([
			'icon' => 'error.png',
			'text' => "Error while creating a new customer in Braintree. {PHP_EOL} Message: {$result->message}",
		]);
	}
	
	// Don't email if mode is dev
	if($_ENV['MODE'] == 'dev'){
		die($app->build->success([
			'message' => 'Registered Successfully'
		]));
	}
	
	// ActiveCampaign add contact
	$post = [
		'email' => $email,
		'p[1]' => 1,
		'ip4' => $app->ip,
	];
	
	// Send ActiveCampaign API request
	$response = $client->request('POST', $query, [
		'form_params' => $post
	]);
	
	$body = $response->getBody();
	$json = (string) $body;
	$result = $app->parse->jsonToArray($json);
	
	if($result['result_code'] != 1) $app->event->log("ActiveCampaign error: {$result['result_code']}{PHP_EOL}Message: {$result['result_message']}");
	
	$app->event->log([
		'text' => "Welcome email sent to {$email}",
		'user_id' => $user_id,
	]);
	
	echo $app->build->success([
		'message' => 'Registered Successfully'
	]);
});