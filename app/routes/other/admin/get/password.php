<?php

$app->post('/admin/get/password', function() use ($app){
	/* Methods */
	
	/* Construction */
	$p = $_POST['pw'];
	echo password_hash($p, PASSWORD_DEFAULT);
});