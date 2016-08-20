<?php

$app->get('/get/module/:a+', function($a) use ($app){
	/* Methods */
	$module = $a[0];
	
	/* Construction */
	if(!file_exists("../app/views/other/modules/{$module}.html")) die($app->build->error("Module {$module} does not exist"));
	
	$css_cache = $app->parse->jsonToArray(file_get_contents('../app/app/resources/.css-cache'));
	$js_cache = $app->parse->jsonToArray(file_get_contents('../app/app/resources/.js-cache'));
	
	$css = isset($css_cache['modules'][$module]) ? $css_cache['modules'][$module] : false;
	$js = isset($js_cache['modules'][$module]) ? $js_cache['modules'][$module] : false;
	
	// Module data from model
	$request = array_splice($a, 1);
	$data = $app->module->require($module, $request);
	
	if($data === false) die($app->build->error('Check your privilege'));
	
	if(isset($data['classes'])){
		foreach($data['classes'] as $key => $value){
			if(isset($js_cache['classes'][$value])){
				$data['classes'][$key] = $js_cache['classes'][$value];
			}else{
				unset($data['classes'][$key]);
			}
		}
	}
	
	echo $app->build->success([
		'css' => $css,
		'js' => $js,
		'third' => (isset($data['third']) ? $data['third'] : []),
		'classes' => (isset($data['classes']) ? $data['classes'] : []),
		'behaviors' => (isset($data['behaviors']) ? $data['behaviors'] : []),
		'module' => $app->build->page("other/modules/{$module}.html", [
			'modules' => [
				$module => $data,
			],
		], false),
	]);
	
});