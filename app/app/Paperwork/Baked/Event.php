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
			'user_id' => isset($app->user['id']) ? $app->user['id'] : 'Guest',
		];
		
		$data = array_merge($default, $event);
		$app->sql->post('event')->with($data)->event()->god()->run();
		
	}
	
}