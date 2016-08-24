<?php

namespace Paperwork\Baked;

class Build {
	
	public function page($html, $data = [], $render = true){
		$app	= \Slim\Slim::getInstance();
		$view	= $app->view();
		
		// Cache
		$css_cache = $app->parse->jsonToArray(file_get_contents('../app/app/resources/.css-cache'));
		$js_cache = $app->parse->jsonToArray(file_get_contents('../app/app/resources/.js-cache'));
		$css = str_replace(['views/', '$', '.html'], '', $html);
		$css = isset($css_cache['views'][$css]) ? $css_cache['views'][$css] : false;
		
		// Cookies
		$menu_state = 'big';
		if(isset($_COOKIE['menu'])){
			if($_COOKIE['menu'] === 'small'){
				$menu_state = 'small';
			}
		}
		
		// Environment
		$environment = [
			'mode' => $_ENV['MODE'],
			'root' => $_ENV['ROOT'],
			'page' => ltrim($app->request->getResourceUri(), '/'),
			'menu' => $menu_state,
			'date' => date('d/m/Y'),
			'trial_expired' => isset($_SESSION['trial_expired']) ? $_SESSION['trial_expired'] : false,
		];
		
		// Merge with SQL config flags
		$environment = array_merge($app->env, $environment);
		
		// All templates contain the following values
		$result = [
			'environment' => $environment,
			'user' => $app->user,
			'head' => $app->schema['patharray']['head'],
			'head_public' => $app->schema['patharray']['head_public'],
			'menu' => $app->schema['patharray']['menu'],
			'js' => $app->schema['patharray']['js'],
			'path' => [
				'html' => $app->schema['patharray'],
				'page_css' => $css,
				'css' => $css_cache,
				'js' => $js_cache,
			],
		];
		
		function deep_merge(array & $array1, array & $array2){
			$merged = $array1;

			foreach($array2 as $key => & $value){
				if(is_array($value) && isset($merged[$key]) && is_array($merged[$key])){
					$merged[$key] = deep_merge($merged[$key], $value);
				}elseif(is_numeric($key)){
					if(!in_array($value, $merged)) $merged[] = $value;
				}else{
					$merged[$key] = $value;
				}

				return $merged;
			}
		}
		
		$result = array_merge($result, $data);
		return $render ? $app->render($html, $result) : $view->render($html, $result);
	}
	
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