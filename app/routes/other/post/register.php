<?php

// use GuzzleHttp\Client;

$app->post('/post/register', 'app', function() use ($app){
	/* Methods */
	// $client = new Client([
	// 	'base_uri' => 'https://paperwork.api-us1.com/admin/api.php',
	// 	'verify' => false,
	// ]);
	
	// ActiveCampaign query parameter
	// $params = [
	// 	'api_key' => '117903f749dc1fd8d6f6d317c10e22bb4d7deadf085c2920826dd197177055f6bf35b891',
	// 	'api_action' => 'contact_add',
	// 	'api_output' => 'json',
	// ];
	
	// Formatted
	// $query = '?';
	// foreach($params as $key => $value) $query .= $key.'='.urlencode($value).'&';
	// $query = rtrim($query, '& ');
	
	$email = isset($_POST['email']) ? filter_var($_POST['email'], FILTER_VALIDATE_EMAIL) : false;
	$first = isset($_POST['first']) ? $_POST['first'] : false;
	$last = isset($_POST['last']) ? $_POST['last'] : false;
	$password = isset($_POST['password']) ? $_POST['password'] : false;
	
	/* Construction */
	if(!$first){
		$app->flash('error', 'Please enter your name.');
		$app->redirect($app->root.'/register');
	}
	
	if(!$email){
		$app->flash('error', 'Please enter a valid email address.');
		$app->redirect($app->root.'/register');
	}
	
	if(!$password){
		$app->flash('error', 'Please enter a password.');
		$app->redirect($app->root.'/register');
	}
	
	$action = $app->auth->register([
		'first' => $first,
		'last' => $last,
		'email' => $email,
		'password' => $password,
		'privilege' => 'trial',
	]);
	
	if(!$action['success']){
		$app->flash('error', $action['message']);
		$app->redirect($app->root.'/register');
	}
	
	// Post registration
	$user_id = $action['id'];
	
	// Add user to Braintree
	$result = Braintree_Customer::create([
		'id' => $user_id,
		'firstName' => $first,
		'lastName' => $last,
		'email' => $email,
	]);
	
	// Log and end on error
	if(!$result->success){
		$app->event->log([
			'icon' => 'error.png',
			'text' => "Error while creating a new customer in Braintree. {PHP_EOL} Message: {$result->message}",
		]);
	}
	
	// ActiveCampaign add contact
	// $post = [
	// 	'first_name' => $first,
	// 	'last_name' => $last,
	// 	'email' => $email,
	// 	'p[1]' => 1,
	// 	'ip4' => $app->ip,
	// ];
	
	// Send ActiveCampaign API request
	// $response = $client->request('POST', $query, [
	// 	'form_params' => $post
	// ]);
	
	// $body = $response->getBody();
	// $json = (string) $body;
	// $result = $app->parse->jsonToArray($json);
	
	// if($result['result_code'] != 1){
	// 	$app->event->log("ActiveCampaign error: {$result['result_code']}, Message: {$result['result_message']}");
	// }
	
	$app->event->log([
		'text' => "New user: {$first} {$last}, {$email}",
		'user_id' => $user_id,
	]);
	
	$action = $app->auth->login($email, $password);
	
	switch($action){
		case 'Invalid Password':
			$app->event->log('entered a wrong password with username: '.$username.'. IP: '.$app->ip);
			$app->flash('error', 'Your username or password was incorrect');
			$app->redirect($app->root.'/login');
			break;
		
		case 'User Disabled':
			$app->event->log('tried to log on to a disabled account, username: '.$username.'. IP: '.$app->ip);
			$app->flash('error', 'This account is currently disabled. Please contact us if you think this is in error.');
			$app->redirect($app->root.'/login');
			break;
		
		case 'User Does Not Exist':
			$app->event->log('tried to log into a non-existant account with username: '.$username.'. IP: '.$app->ip);
			$app->flash('error', 'Your username or password was incorrect');
			$app->redirect($app->root.'/login');
			break;
		
		case 'Authenticated Successfully':
			$app->redirect($app->root.'/onboard/region');
			break;
	}
});