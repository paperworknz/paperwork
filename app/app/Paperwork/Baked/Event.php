<?php

namespace Paperwork\Baked;

class Event {
	
	public function log($event){
		$app = \Slim\Slim::getInstance();
		
		$default = [
			'level' => 'Information',
			'text' => '',
			'uacID' => 'N/A'
		];
		
		$data = array_merge($default, $event);
		$app->sql->post('master.events')->with($data)->run();
		
	}
	
}