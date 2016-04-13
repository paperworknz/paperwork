<?php

$app->get('/', 'app', function() use($app){
	/* Methods */
	
	/* Construction */
	$app->build->page('views/home.html');
});