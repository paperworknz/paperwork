<?php

namespace Paperwork\Extended;
use \PDO;

class Form {
	
	private $cache = [
		'cacheID'	=> '',
		'array'		=> [],
		'json'		=> '',
		'formjs'	=> ''
	];
	
	public function __construct(){
		$app = \Slim\Slim::getInstance();
		$this->cache['formjs'] = $app->services['Form']['current'];
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
					}else{		// formjs is the same but templates have changed
						if($app->services['Form']['rollback'] == false){
							$app->sql->put('job_cache')->with([						// We aren't rolling back so update templates
								'content' => $this->cache['json']
							])->where('cacheID', '=', $latest['cacheID'])->run();
						}
						$this->cache['cacheID'] = $latest['cacheID'];				// Use this cache because it matches the public formjs
					}
				}else{ // Formjs versions are not the same
					$version['old'] = trim(preg_replace('/[^0-9.]+/', '', $latest['formjs']), '.'); 	// Leave only numbers and periods
					$version['new'] = trim(preg_replace('/[^0-9.]+/', '', $this->cache['formjs']), '.'); 	// and trim preceeding/ending periods
					$version['old.open'] = explode('.', $version['old']);
					$version['new.open'] = explode('.', $version['new']);
					if($version['old.open'][0] == $version['new.open'][0]){		// Check if major version is the same
						if($version['old.open'][1] != $version['new.open'][1]){		// Check if incremental version is different
							if($app->services['Form']['rollback'] == false){
								$app->sql->put('job_cache')->with([						// We aren't rolling back so update templates
									'content'	=> $this->cache['json'],
									'formjs'	=> $this->cache['formjs']
								])->where('cacheID', '=', $latest['cacheID'])->run();	// Update formjs, it's missing an incremental update
							}else if($app->services['Form']['rollback'] == true){
								$app->sql->put('job_cache')->with([						// We ARE rolling back so leave templates alone
									'formjs'	=> $this->cache['formjs']
								])->where('cacheID', '=', $latest['cacheID'])->run();	// Update formjs, it's missing an incremental update
							}
							$this->cache['cacheID'] = $latest['cacheID'];				// Use this cache because it now matches the public formjs
							break;
						}else{
							die('This shouldn\'t occur.');
						}
					}else{ // Major version change, don't use this one
						unset($version);
						continue;
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