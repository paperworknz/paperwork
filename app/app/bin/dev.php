<?php

function dd($val){
	echo '<pre>', var_dump($val), '</pre>';
	die();
}

function go(){
	$_ENV['go'] = microtime();
}

function stop(){
	$stop = microtime();
	die($stop - $_ENV['go']);
}