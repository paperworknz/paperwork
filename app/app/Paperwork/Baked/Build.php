<?php

namespace Paperwork\Baked;

class Build {
	
	public function page($html, $data = [], $render = true){
		$app	= \Slim\Slim::getInstance();
		$view	= $app->view();
		
		// CSS Cache
		$css = str_replace(['views/', '$', '.html'], '', $html);
		$css_cache = $app->parse->jsonToArray(file_get_contents('../app/app/resources/.css-cache'));
		$css = isset($css_cache[$css]) ? $css_cache[$css] : $css = $css.'.css';
		
		// JS Cache
		$js_cache = $app->parse->jsonToArray(file_get_contents('../app/app/resources/.js-cache'));
		
		// Cookies
		if(isset($_COOKIE['sidebar'])){
			if($_COOKIE['sidebar'] === 'big'){
				$sidebar = 'big';
			}elseif($_COOKIE['sidebar'] === 'small'){
				$sidebar = 'small';
			}
		}else{
			$sidebar = 'big';
		}
		
		// Template array, all datasets contain these following values
		$result = [
			'path' => [
				'root' => $app->root,
				'paperwork_css' => $css_cache['@Paperwork'],
				'public_css' => $css_cache['@Public'],
				'page_css' => $css,
				'paperwork_js' => $js_cache['@Paperwork'],
				'js_cache' => $js_cache,
				'page' => ltrim($app->request->getResourceUri(), '/'),
			],
			'env'	=> $app->env,
			'user'	=> $app->user,
			'date'	=> date('d/m/Y'),
			'state'	=> $_ENV['MODE'],
			'sidebar' => $sidebar,
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