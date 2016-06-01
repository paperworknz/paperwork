<?php

$_ENV = require '../app/app/.environment';

date_default_timezone_set('NZ');

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