<?php

// Switch Service
$temp	= []; // $app environment array
$config = $app->sql
	->get('config')
	->select(['name', 'value'])
	->god()
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

// Twig scaffolding nav bar
if(!isset($temp['nav'])){
	if(isset($_COOKIE['nav'])){
		if($_COOKIE['nav'] === 'small' || $_COOKIE['nav'] === 'big'){
			$temp['nav'] = $_COOKIE['nav'];
		}
	}
}

return $temp; // $app->env contains switches