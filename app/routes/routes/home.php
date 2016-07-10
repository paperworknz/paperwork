<?php

$app->get('/', 'app', function() use($app){
	/* Methods */
	$promotion = false;
	
	/* Construction */
	if(isset($_GET['src'])){
		$src = $_GET['src'];
		
		if($src == 'facebook'){
			if(!isset($_COOKIE['promo'])){
				setcookie('promo', time() + 3600, time() + 3600, '/');
			}
		}
	}
	
	$app->event->log('browsed the landing page with IP: '.$app->ip);
	$app->build->page('views/home.html');
});