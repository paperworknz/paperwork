<?php

$_ENV = require '../app/app/.environment';

date_default_timezone_set('NZ');

switch($_ENV['MODE']){
	case 'dev':
		ini_set('display_errors', 'on');
		fclose(fopen('../app/app/storage/temp/sql.log', 'w'));
		break;
	
	case 'prod':
		ini_set('display_errors', 'off');
		break;
}