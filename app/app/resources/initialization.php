<?php

$_ENV = require '../app/app/.environment';

date_default_timezone_set('NZ');

if(!empty($_SERVER['HTTP_CLIENT_IP'])){
	$app->ip = $_SERVER['HTTP_CLIENT_IP'];
}elseif(!empty($_SERVER['HTTP_X_FORWARDED_FOR'])){
	$app->ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
}else{
	$app->ip = $_SERVER['REMOTE_ADDR'];
}

switch($_ENV['MODE']){
	case 'dev':
		ini_set('display_errors', 'on');
		$app->config('debug', true);
		break;
	
	case 'prod':
		ini_set('display_errors', 'off');
		$app->config('debug', false);
		break;
}