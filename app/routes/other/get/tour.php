<?php

$app->post('/get/tour', function() use ($app){
	/* Methods */
	$page = isset($_POST['page']) ? $_POST['page'] : false;
	
	/* Construction */
	if($page){
		
		// Replace numeric shards with *
		$page = explode('/', $page);
		
		// Replace numeric uri shard with SQL wildcard
		foreach($page as $key => $value) if(ctype_digit($value)) $page[$key] = '%';
		
		// Implode back to string
		$page = implode('/', $page);
		
		$items = $app->sql->get('tour')->select(['id', 'text', 'anchor', 'position', 'commands'])
		->where('page', 'LIKE', $page)->all();
		
		// Manipulate each value
		foreach($items as $key => $value) $items[$key] = str_replace(PHP_EOL, '<br>', $value);
		
		if($items) echo $app->parse->arrayToJson($items);
	}
});