<?php

$app->post('/post/temporary-user', 'app', function() use ($app){
	/* Methods */
	
	/* Construction */
	// Check for available users
	$user = $app->sql->get('user')->where('privilege', '=', 'guest')->and('active', '=', '0')->root()->one();
	
	if($user){
		$action = $app->auth->login($user['username'], '', true); // Third param = force login, password not used
		
		// Handle result of login
		if($action == 'Authenticated Successfully'){
			
			// Rebuild Quote template
			if(null !== file_get_contents('../app/app/storage/templates/Default/quote-inline.html')){
				$template = file_get_contents('../app/app/storage/templates/Default/quote-inline.html');
				
				$app->sql->post('job_form_template')->with([
					'user_id' => $user['id'],
					'name' => 'Quote',
					'content' => $template,
				])->root()->run();
			}
			
			// Rebuild Invoice template
			if(null !== file_get_contents('../app/app/storage/templates/Default/invoice-inline.html')){
				$template = file_get_contents('../app/app/storage/templates/Default/invoice-inline.html');
				
				$app->sql->post('job_form_template')->with([
					'user_id' => $user['id'],
					'name' => 'Invoice',
					'content' => $template,
				])->root()->run();
			}
			
			// Built in statuses
			$app->sql->post('job_status')->with([
				'user_id' => $user['id'],
				'name' => 'New',
				'job_status_number' => 1,
			])->root()->run();
			$app->sql->post('job_status')->with([
				'user_id' => $user['id'],
				'name' => 'In Progress',
				'job_status_number' => 2,
			])->root()->run();
			$app->sql->post('job_status')->with([
				'user_id' => $user['id'],
				'name' => 'Invoiced Out',
				'job_status_number' => 3,
			])->root()->run();
			$app->sql->post('job_status')->with([
				'user_id' => $user['id'],
				'name' => 'Completed',
				'job_status_number' => 4,
			])->root()->run();
			
			$user = $app->sql->get('user')->where('id', '=', $user['id'])->root()->one();
			// -> continue
			
		}else{
			$app->event->log([
				'text' => 'Guest user authentication failed',
				'icon' => 'error.png',
			]);
			
			echo $app->build->error('We\'re sorry - this is unavailable right now.');
			return;
		}
	}else{
		// Create random string
		$random = substr(str_shuffle(md5(time())), 0, 6);
		
		// Register new user, no email
		$action = $app->auth->register([
			'first' => 'Guest',
			'last' => 'User',
			'company' => 'Your Company Name',
			'username' => $random,
			'password' => $random,
			'confirm' => $random,
			'email' => $random.'@paperwork.nz',
			'privilege' => 'guest',
		]);
		
		// Handle result of registration
		if($action == 'Registered Successfully'){
			
			$login = $app->auth->login($random, '', true); // Third param = force login, password not used
			if($login = 'Authenticated Successfully'){
				
				$user = $app->sql->get('user')->where('username', '=', $random)->root()->one();
				// -> continue
			}
		}else{
			$app->event->log([
				'text' => 'Guest user registration failed, reason: '.$action,
				'icon' => 'error.png',
			]);
			
			echo $app->build->error('We\'re sorry - this is unavailable right now.');
		}
	}
	
	// Post Tour
	$app->sql->post('tour')->with([
		'text' => 'Create a new Client and Job from this button',
		'page' => 'jobs',
		'anchor' => '.create-new',
		'position' => 'right',
	])->run();
	
	$app->sql->post('tour')->with([
		'text' => 'Most text boxes will save automatically, try add some information!',
		'page' => 'client/*',
		'anchor' => '#bottom',
		'position' => 'bottom',
	])->run();
	
	$app->sql->post('tour')->with([
		'text' => 'Click this button to open the Quote/Invoice screen',
		'page' => 'job/*',
		'anchor' => '[data-tab="+"]',
		'position' => 'right',
		'commands' => '{"chain":false}',
	])->run();
	
	$app->sql->post('tour')->with([
		'text' => 'Label your job as it progresses to keep on top of things!'.PHP_EOL.'Make your own labels from the settings page.',
		'page' => 'job/*',
		'anchor' => '.status',
		'position' => 'left',
		'commands' => '{"e.activateTab":0}',
	])->run();
	
	// Log
	$app->event->log('Guest user logged in with IP: '.$app->ip);
	
	// Return
	echo $app->build->success([
		'location' => $app->root.'/app',
	]);
});