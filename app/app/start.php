<?php

require '../composer/vendor/autoload.php';	// Composer
require 'resources/schema/schema.php';		// Astral
include 'bin/dev.php';						// dev tools

use Paperwork\Baked\SQL,
	Paperwork\Baked\Build,
	Paperwork\Baked\Event,
	Paperwork\Baked\Parse,
	Paperwork\Baked\Cookie;

date_default_timezone_set('NZ');
session_name('Paperwork');
session_start();

$_ENV = array_merge(require '.environment', $_ENV); // Environment variables

switch($_ENV['MODE']){
	case 'dev'	: ini_set('display_errors', 'on'); break;
	case 'prod'	: ini_set('display_errors', 'off'); break;
}

// ============== Container =============== //
$app			= new \Slim\Slim(['view' => new \Slim\Views\Twig()]); // Slim as $app
$app->sql		= new SQL;			// $app->sql: Wraps PDO. eg $app->get(table)->where(x,y,z)->run()
$app->build		= new Build;		// $app->build->page: Wraps render with standard data
$app->event		= new Event;		// $app->event: Log to master.events $app->event->log();
$app->parse		= new Parse;		// $app->parse: Parse json <-> php array
$app->cookie	= new Cookie;		// $app->cookie: Refreshing and removing php sessions
$app->services	= require '.services'; // Micro-services array
$app->root		= $_ENV['ROOT'];	// $app->root is the document root as a string. From .environment
$app->schema	= $_schema;			// Schema is an Astral array of indexes

// ============== Templating =============== //
$app->view->setTemplatesDirectory('../app/views');
$app->view->parserOptions = ['strict_variables' => false];
$app->view->parserExtensions = [new \Slim\Views\TwigExtension()];
require 'resources/controller/controller.php'; // Script to match URI with Astral schema to load route
$app->run();