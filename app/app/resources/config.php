<?php

// Switch Service
$temp	= []; // $app environment array
$config = $app->sql
	->get('config')
	->select(['name', 'value'])
	->root()
	->all();

foreach($config as $item){
	
	$name 	= $item['name']; // Name
	$value 	= $item['value']; // Value
	
	switch($value){
		case 'true':
		case 'false':
		case '0':
		case '1':
			$value = filter_var($value, FILTER_VALIDATE_BOOLEAN);
	}
	
	$temp[$name] = $value; // Populate $temp
}

return $temp; // $app->env contains switches