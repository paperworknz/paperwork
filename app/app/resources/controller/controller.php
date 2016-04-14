<?php

// PDO Connections
$app->pdo = new StdClass;	// Empty object, to be populated with PDO objects
$app->pdo->master = new PDO( // PDO object connecting to the master database
	$_ENV['PDO_DRIVER'].':host='.$_ENV['DB_HOST'].';dbname='.$_ENV['DB_PREFIX'].'master',
	$_ENV['DB_USER'],
	$_ENV['DB_PASSWORD']
);

// Switch Service
$temp 	= []; // $app environment array
$switch = $app->sql->get('master.switch')->all()->run();
foreach($switch as $key){
	$name 	= $key['name']; // Name
	$value 	= $key['value']; // Value
	
	switch($value){
		case 'true':
		case 'false':
		case '0':
		case '1':
			$value = filter_var($value, FILTER_VALIDATE_BOOLEAN);
	}
	
	$temp[$name] = $value; // Populate $temp
}
$app->env = $temp; // $app->env contains switches

// User authentication before every route
$app->hook('slim.before.dispatch', function() use ($app){
	if(isset($_COOKIE['@'])){
		if($user = $app->sql->get('master.uac')->where('cookie', '=', $_COOKIE['@'])->run()){ // Valid Cookie
			$app->cookie->session($_COOKIE['@'], $user); // Re/start session
			$app->pdo->user = new PDO( // User is authenticated OK, DB access
				$_ENV['PDO_DRIVER'].':host='.$_ENV['DB_HOST'].';dbname='.$_ENV['DB_PREFIX'].$user['username'],
				$_ENV['DB_USER'],
				$_ENV['DB_PASSWORD']
			);
			// -> continue to route
		}else{
			$app->cookie->destroy(); // Invalid cookie
			// cookie.destroy redirects to home
		}
	}else{
		if(isset($_SESSION['user'])) $app->cookie->destroy(); // No cookie but an active session
	}
});

// Middleware
function uac(){
	if(!isset($_SESSION['user'])){
		$app = \Slim\Slim::getInstance();
		$app->redirect($app->root);
	}
}

function admin(){
	$app = \Slim\Slim::getInstance();
	if($app->user['username'] != 'admin'){
		$app->redirect($app->root);
	}
}

function app(){
	if(isset($_SESSION['user'])){
		$app = \Slim\Slim::getInstance();
		$app->redirect($app->root.'/app');
	}
}

// Include {uri}.php from schema array or special routes if {uri}.php doesn't exist
include 
	isset($app->schema['filearray'][$app->request->getResourceUri()]) ? 
		$app->schema['filearray'][$app->request->getResourceUri()] :
		'special.php';