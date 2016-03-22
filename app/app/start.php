<?php

require '../composer/vendor/autoload.php';	// Composer
include 'bin/dev.php';						// Dev tools
$_ENV = require '.environment';				// Environment variables

date_default_timezone_set('NZ');
session_name('Paperwork');
session_start();

switch($_ENV['MODE']){
	case 'dev'	: ini_set('display_errors', 'on'); break;
	case 'prod'	: ini_set('display_errors', 'off'); break;
}

$app			= new \Slim\Slim(['view' => new \Slim\Views\Twig()]); // Slim as $app
$app->sql		= new \Paperwork\Baked\SQL;		// $app->sql: Wraps PDO. eg $app->get(table)->where(x,y,z)->run()
$app->build		= new \Paperwork\Baked\Build;	// $app->build->page: Wraps render with standard data
$app->event		= new \Paperwork\Baked\Event;	// $app->event: Log to master.events $app->event->log();
$app->parse		= new \Paperwork\Baked\Parse;	// $app->parse: Parse json <-> php array
$app->cookie	= new \Paperwork\Baked\Cookie;	// $app->cookie: Refreshing and removing php sessions
$app->schema	= require '.schema';			// Schema is an Astral array of indexes
$app->services	= require '.services';			// Micro-services array
$app->root		= $_ENV['ROOT'];				// $app->root is the document root as a string. From .environment

$app->view->setTemplatesDirectory('../app/views');

require 'resources/controller/controller.php'; // Script to match URI with Astral schema to load route
$app->run();