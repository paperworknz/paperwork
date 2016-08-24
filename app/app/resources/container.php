<?php

$app->root		= $_ENV['ROOT'];						// $app->root is the document root as a string. From .environment
$app->sql		= new \Paperwork\Baked\SQL;				// $app->sql: database abstraction layer
$app->file		= new \Paperwork\Baked\File;			// $app->file: file system abstraction layer
$app->build		= new \Paperwork\Baked\Build;			// $app->build->page: Wraps render with standard data
$app->event		= new \Paperwork\Baked\Event;			// $app->event: Log to master.events $app->event->log();
$app->parse		= new \Paperwork\Baked\Parse;			// $app->parse: Convert php array <-> json
$app->auth		= new \Paperwork\Baked\Authentication;	// $app->auth: Login, Session, Destroy
$app->module	= new \Paperwork\Baked\Module;
$app->SQLBackup = new \Paperwork\Extended\SQLBackup;	// Used in SQL
$app->document	= new \Paperwork\Extended\Document;

$app->schema	= require '.schema';	// Schema is an Astral array of indexes
$app->env		= require 'config.php';	// $app->env is an array of all run-time
