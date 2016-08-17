<?php

namespace Paperwork\Baked;

class Parse {
	
	public function arrayToJson($array) {
		if(!is_array($array)) return false;
		
		return json_encode($array);
	}
	
	public function jsonToArray($string) {
		if(!is_string($string)) return false;
		
		return json_decode($string, true);
	}
	
}