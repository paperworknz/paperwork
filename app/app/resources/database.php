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
		$log = fopen('../app/app/storage/temp/sql.log', 'a');
		fwrite($log, $query['query'].' in '.$query['time'].'sec'.PHP_EOL);
		fclose($log);
	},
]);