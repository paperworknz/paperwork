<?php

use Paperwork\Baked\SQL;

SQL::configure([
	'host'		=> $_ENV['DB_HOST'],
	'database'	=> $_ENV['DATABASE'],
	'user'		=> $_ENV['DB_USER'],
	'password'	=> $_ENV['DB_PASSWORD'],
	'cache'		=> true,
	'logging'	=> false,
	'logger'	=> function($query){
		var_dump($query);
	},
]);