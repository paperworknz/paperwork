<?php

// Convert html encoded text into raw html (displayed on-screen), useful for converting job templates json strings
$html = file_get_contents('html.txt');
$html = html_entity_decode($html);
$html = str_replace('\\/', '/', $html);

echo $html;