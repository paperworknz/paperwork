<?php

namespace Paperwork\Baked;

class Build {
	
	public function page($html, $data = [], $render = true){
		$app	= \Slim\Slim::getInstance();
		$css	= $app->root.'/inc/paperwork/'.str_replace('.html', '.css', $html); // http://.../inc/paperwork/views/{{uri}}.css, each uri has a corresponding css file
		$view	= $app->view();
		
		// Template array, all datasets contain these following values
		$result = [
			'path' => [
				'root'	=> $app->root,
				'css'	=> $css,
			],
			'user'	=> $app->user,
			'date'	=> date('d/m/Y'),
		];
		
		$result['path'] = array_merge($result['path'], $app->schema['patharray']);	// Merge this path with $app's path
		$result = array_merge($result, $data); // Merge $result with data, creating the resulting data
		
		// Check if the model has ommitted the render parameter
		if($render === true){ // The default mode: Rendering is delegated to this function
			$app->render($html, $result);
		}else if($render === false){ // If render is false this function returns the dataset and the Model will have to render the view
			return $view->render($html, $result);
		}
	}
	
	// $app->build->error('Everything broke!'); ==> 'message' => 'Everything broke!'
	// or
	/* $app->build->error([
		'message' => 'Everything broke!',
		'log' => $errorlog,
		'helpfuldata' => $helpfuldata
	]); */
	public function error($input){
		$app	= \Slim\Slim::getInstance();
		$return	= [
			'type' => 'error',
		];
		if(is_string($input)){
			$return['message'] = $input;
		}else{
			foreach($input as $key => $value){
				$return[$key] = $value;
			}
		}
		return $app->parse->arrayToJson($return);
	}
	
	/* $app->build->success([
		'client' => $client,
		'job' => $job,
	]); */
	public function success($array){
		$app	= \Slim\Slim::getInstance();
		$return	= [
			'type' => 'success',
		];
		foreach($array as $key => $value){
			$return[$key] = $value;
		}
		return $app->parse->arrayToJson($return);
	}
	
}