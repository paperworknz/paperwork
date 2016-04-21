<?php

// Cookie validation before every route
$app->hook('slim.before.dispatch', function() use ($app){
	$app->auth->validate();
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