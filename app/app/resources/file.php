<?php

use Paperwork\Baked\File;

File::configure([
	'logging'	=> false,
	'logger'	=> function($query){
		var_dump($query);
	},
]);