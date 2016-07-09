<?php

require '../composer/vendor/autoload.php';	// Composer
require 'resources/helpers.php';			// Dev tools

$app = new \Slim\Slim([
	'view' => new \Slim\Views\Twig(),
]);
$app->view->setTemplatesDirectory('../app/views');

require 'resources/initialization.php';		// PHP and Slim config
require 'resources/error.php';				// Error handling
require 'resources/database.php';			// SQL config
require 'resources/braintree.php';			// Credit payment setup
require 'resources/container.php';			// $app container
require 'resources/controller.php';			// Route controller

$app->run();