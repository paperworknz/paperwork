<?php

namespace Paperwork\Extended;

class Number {
	
	public function next($table){
		$app = \Slim\Slim::getInstance();
		
		$number = $table.'_number';
		$user_number = 'user_number';
		
		// Get latest from table
		$id = $app->sql->get($table)->select($number)->also("ORDER BY {$number} DESC LIMIT 1")->soft()->one();
		
		// Get current number value
		$current = $app->sql->get($user_number)->select($number)->one();
		
		$id = $id ? $id + 1 : 1;
		$current = $current ? $current : 0;
		
		if($id > $current){
			$app->sql->put($user_number)->with([
				$number => $id
			])->run();
		}else{
			$id = $current;
		}
		
		return $id;
		
	}
	
	public function get($table){
		$app = \Slim\Slim::getInstance();
		
		$number = $table.'_number';
		$user_number = 'user_number';
		
		// Get current number value
		$id = $app->sql->get($user_number)->select($number)->one();
		
		// Normalise
		if(!$id){
			if($id != 0){
				die('ERROR: Unknown number name');
			}
		}
		
		return $id;
		
	}
	
}