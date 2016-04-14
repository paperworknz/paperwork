<?php

namespace Paperwork\Extended;

class Form {
	
	private $cache = [
		'cacheID'	=> '',
		'array'		=> [],
		'json'		=> '',
		'formjs'	=> ''
	];
	
	private $current = 'Armadyl.js';
	private $rollback = false;
	
	public function __construct(){
		$app = \Slim\Slim::getInstance();
		$this->cache['formjs'] = $this->current;
	}
	
	public function newCache(){
		$app = \Slim\Slim::getInstance();
		
		$templates = $app->sql->get('job_form_templates')->all()->run();
		foreach($templates as $item){
			$this->cache['array'][$item['templateID']] = [
				'name'		=> $item['name'],
				'content'	=> $item['content']
			];
		}
		
		// Store json version of cache
		$this->cache['json'] = $app->parse->arrayToJson($this->cache['array']);
	}
	
	public function cache(){
		$app = \Slim\Slim::getInstance();
		
		$this->newCache();
		
		// Compare new cache with existing caches, update form.js if an incremental update is found
		if($existing = $app->sql->get('job_cache')->by('cacheID DESC')->all()->run()){	// Get all caches from newest to oldest
			foreach($existing as $latest){
				if($latest['formjs'] == $this->cache['formjs']){	// Check if the formjs versions are the same
					if($latest['content'] == $this->cache['json']){		// Check if templates json are the same
						$this->cache['cacheID'] = $latest['cacheID'];		// No difference, cache is valid, use it
						break;												// Found what we came for, break out of loop
					}else{	// formjs is the same but templates have changed
						if($this->rollback == false){
							$app->sql->put('job_cache')->with([		// We aren't rolling back so update templates
								'content' => $this->cache['json']
							])->where('cacheID', '=', $latest['cacheID'])->run();
						}
						$this->cache['cacheID'] = $latest['cacheID'];	// Use this cache because it matches the public formjs
					}
				}
			}
		}
		
		if($this->cache['cacheID'] == ''){
			$this->cache['cacheID'] = $app->sql->post('job_cache')->with([
				'content'	=> $this->cache['json'],
				'formjs'	=> $this->cache['formjs']
			])->run();
		}
		
		return $this->cache['cacheID'];
	}
	
}