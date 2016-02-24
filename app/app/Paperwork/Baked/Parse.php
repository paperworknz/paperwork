<?php

namespace Paperwork\Baked;

class Parse {
	
	public function arrayToJson($array) {
		if(is_array($array)){
			return json_encode($array);
		}else{
			die('Not an array.');
		}
	}
	
	public function jsonToArray($string) {
		if(is_string($string)){
			return json_decode($string, true);
		}else{
			die('Not a string.');
		}
	}
	
}