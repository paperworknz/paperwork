<?php

require '../composer/vendor/autoload.php';	// Composer
include 'bin/dev.php';						// Dev tools
$_ENV = require '.environment';				// Environment variables

date_default_timezone_set('NZ');

switch($_ENV['MODE']){
	case 'dev'	: ini_set('display_errors', 'on'); break;
	case 'prod'	: ini_set('display_errors', 'off'); break;
}

$app = new \Slim\Slim(['view' => new \Slim\Views\Twig()]);	// Slim as $app
$app->view->setTemplatesDirectory('../app/views');			// Twig template directory

$app->root		= $_ENV['ROOT'];						// $app->root is the document root as a string. From .environment
$app->pdo		= new StdClass;							// Empty object, to be populated with PDO objects
$app->sql		= new \Paperwork\Baked\SQL;				// $app->sql: Wraps PDO. eg $app->get(table)->where(x,y,z)->run()
$app->build		= new \Paperwork\Baked\Build;			// $app->build->page: Wraps render with standard data
$app->event		= new \Paperwork\Baked\Event;			// $app->event: Log to master.events $app->event->log();
$app->parse		= new \Paperwork\Baked\Parse;			// $app->parse: Convert php array <-> json
$app->auth		= new \Paperwork\Baked\Authentication;	// $app->auth: Login, Session, Destroy

$app->pdo->master = new PDO(
	$_ENV['PDO_DRIVER'].':host='.$_ENV['DB_HOST'].';dbname='.$_ENV['DB_PREFIX'].'master',
	$_ENV['DB_USER'],
	$_ENV['DB_PASSWORD']
); // PDO object connecting to the master database

$app->schema	= require '.schema';					// Schema is an Astral array of indexes
$app->env		= require 'resources/Switch.php';		// $app->env is an array of all run-time switches

require 'resources/controller/controller.php';			// Script to match URI with Astral schema to load route
$app->run();