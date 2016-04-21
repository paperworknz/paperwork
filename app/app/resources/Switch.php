<?php

// Switch Service
$temp	= []; // $app environment array
$switch = $app->sql->get('master.switch')->all()->run();

foreach($switch as $key){
	$name 	= $key['name']; // Name
	$value 	= $key['value']; // Value
	
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