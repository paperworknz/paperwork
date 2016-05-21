<?php

namespace Paperwork\Baked;

class Event {
	
	public function log($event){
		$app = \Slim\Slim::getInstance();
		
		if(!$app->env['events']) return;
		
		$default = [
			'user_id' => isset($app->user['id']) ? $app->user['id'] : 'Guest',
			'icon' => 'default.png',
		];
		
		if(is_array($event)){
			$data = array_merge($default, $event);
		}else{
			$default['text'] = $event;
			$data = $default;
		}
		
		$app->sql->post('event')->with($data)->event()->god()->run();
		
	}
	
}