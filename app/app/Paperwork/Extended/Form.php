<?php

namespace Paperwork\Extended;

class Form {
	
	private $cache = [
		'id'		=> '',
		'array'		=> [],
		'json'		=> '',
		'painter'	=> ''
	];
	
	private $rollback = false;
	
	public function __construct(){
		$app = \Slim\Slim::getInstance();
		$this->cache['painter'] = $app->parse->jsonToArray(file_get_contents('../app/app/resources/.resources'))['painter'];;
	}
	
	protected function newCache(){
		$app = \Slim\Slim::getInstance();
		
		$templates = $app->sql->get('job_form_template')->all();
		foreach($templates as $template){
			$this->cache['array'][$template['id']] = [
				'name'		=> $template['name'],
				'content'	=> $template['content']
			];
		}
		
		// Store json version of cache
		$this->cache['json'] = $app->parse->arrayToJson($this->cache['array']);
	}
	
	public function cache(){
		$app = \Slim\Slim::getInstance();
		
		$this->newCache();
		
		// Compare new cache with existing caches, update form.js if an incremental update is found
		if($existing = $app->sql->get('job_cache')->also('ORDER BY id DESC')->all()){ // Get all caches from newest to oldest
			foreach($existing as $latest){
				if($latest['painter'] == $this->cache['painter']){	// Check if the painter versions are the same
					if($latest['content'] == $this->cache['json']){	// Check if templates json are the same
						$this->cache['id'] = $latest['id'];		// No difference, cache is valid, use it
						break;									// Found what we came for, break out of loop
					}else{	// painter is the same but templates have changed
						if($this->rollback == false){
							$app->sql->put('job_cache')->with([	// We aren't rolling back so update templates
								'content' => $this->cache['json']
							])->where('id', '=', $latest['id'])->run();
						}
						$this->cache['id'] = $latest['id'];	// Use this cache because it matches the public painter
					}
				}
			}
		}
		
		if($this->cache['id'] == ''){
			$this->cache['id'] = $app->sql->post('job_cache')->with([
				'content'	=> $this->cache['json'],
				'painter'	=> $this->cache['painter']
			])->run();
		}
		
		return $this->cache['id'];
	}
	
}