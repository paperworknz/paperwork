<?php

// Cookie validation before every route
$app->hook('slim.before.dispatch', function() use ($app){
	$app->auth->validate();
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
		$app->redirect($app->root);
	}
	
	// If the user is a baby, redirect to /checkout
	if($app->user['privilege'] == 'baby'){
		$app->redirect($app->root.'/checkout');
	}
}

function baby(){ // User.privilege = baby
	$app = \Slim\Slim::getInstance();
	
	// If the user is not a baby and not an admin, redirect to home
	if($app->user['privilege'] != 'baby' && $app->user['privilege'] != 'admin'){
		$app->redirect($app->root.'/app');
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