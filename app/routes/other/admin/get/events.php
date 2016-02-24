<?php

$app->post('/admin/get/events', function() use ($app){
	/* Methods */
	
	/* Construction */
	$events = $app->sql->get('master.events')->all()->run();
	echo $app->parse->arrayToJson($events);
});