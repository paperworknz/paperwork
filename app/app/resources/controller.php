<?php

// Cookie validation before every route
$app->hook('slim.before.dispatch', function() use ($app){
	$app->auth->validate();
	
	// Timezone
	date_default_timezone_set($app->user['timezone'] ?: 'Pacific/Auckland');
});

// Middleware
function app(){ // Public pages
	$app = \Slim\Slim::getInstance();
	
	// If the user has a valid session, redirect inside the app
	if(isset($_SESSION['user'])){
		
		// UNLESS the user is an admin
		if($app->user['privilege'] != 'admin'){
			$app->redirect($app->root.'/app');
		}
	}
}

function uac(){ // User controlled pages (in the app)
	$app = \Slim\Slim::getInstance();
	
	// If the user does NOT have a valid session, redirect to home
	if(!isset($_SESSION['user'])){
		$app->build->page('views/login.html', [
			'privilege' => true,
		]);
		die();
	}
	
	$_SESSION['trial_expired'] = false;
	
	// If a baby user's trial has expired
	if($app->user['privilege'] == 'baby') {
		// $today = new DateTime();
		// $created = new DateTime($app->user['date_created']);
		// $difference = $today->diff($created);
		
		// if($difference->d >= 14){
			$_SESSION['trial_expired'] = true;
		// }
	}
	
	// If a guest user has been logged in for more than 24 hours
	if($app->user['privilege'] == 'guest') {
		$today = new DateTime();
		$created = new DateTime($app->user['date_created']);
		$difference = $today->diff($created);
		
		if($difference->d >= 1){
			$app->auth->logout();
		}
	}
}

function admin(){ // User.privilege = admin
	$app = \Slim\Slim::getInstance();
	
	// If the user is not an admin, redirect to home
	if($app->user['privilege'] != 'admin'){
		$app->redirect($app->root);
	}
}


// Include {uri}.php from schema array or special routes if {uri}.php doesn't exist
include 
	isset($app->schema['filearray'][$app->request->getResourceUri()]) ? 
		$app->schema['filearray'][$app->request->getResourceUri()] :
		'controller-special.php';