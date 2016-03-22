<?php

namespace Paperwork\Baked;

class Event {
	
	public function log($event){
		$app = \Slim\Slim::getInstance();
		
		$default = [
			'title' => 'Event',
			'text' => '',
			'number' => 0,
			'level' => 'Information',
			'uacID' => 'N/A',
		];
		
		$data = array_merge($default, $event);
		$app->sql->post('master.events')->with($data)->log()->run();
		
	}
	
}