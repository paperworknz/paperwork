<?php

function dd($val){
	echo '<pre>', var_dump($val), '</pre>';
	die();
}

function go(){
	$_ENV['go'] = microtime(true);
}

function stop(){
	$stop = microtime(true);
	return $stop - $_ENV['go'];
}