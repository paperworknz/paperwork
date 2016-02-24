<?php

require 'app/Astral.php';
$astral = new Astral();

$astral->run([
	'route_builder',
	'url_builder',
	'html_path_builder',
	'schema_builder',
]);