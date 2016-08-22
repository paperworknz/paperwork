<?php

use GuzzleHttp\Client,
	Symfony\Component\Process\Process,
	Symfony\Component\HttpFoundation\Response;

$app->post('/post/pdf', 'uac', function() use ($app){
	/* Methods */
	$directory = isset($_POST['directory']) ? $_POST['directory'] : '';
	$properties = isset($_POST['properties']) ? $_POST['properties'] : false;
	
	/* Construction */
	$client = new Client([
		'base_uri' => 'http://api.pdflayer.com/api/convert',
	]);
	
	$params = [
		'access_key' => '9dba89013f131f6ae8bf2280b5ab0cd2',
		'test' => 1,
		'margin_top' => 0,
		'margin_right' => 0,
		'margin_bottom' => 0,
		'margin_left' => 0,
		'creator' => 'www.paperwork.nz',
		'author' => 'www.paperwork.nz',
		'page_size' => 'A4',
		'orientation' => 'portrait',
		'zoom' => 1,
		'no_hyperlinks' => 1,
		'no_javascript' => 1,
		// 'use_print_media' => 1,
		// 'title' => '',
		// 'subject' => '',
		// 'page_width' => 0,
		// 'page_height' => 0,
		// 'inline' => 0, // inline PDF (default is to trigger download)
		// 'ttl' => 5, // cache time in seconds (default 30 days (ommit this line)),
		// 'header_text' => 'raw string',
		// 'header_align' => 'left', // centered default,
		// 'header_url' => '//',
		// 'header_html' => 'raw html',
		// 'header_spacing' => 0,
		// 'footer_text' => 'raw string',
		// 'footer_align' => 'left',
		// 'footer_url' => '//',
		// 'footer_html' => 'raw html',
		// 'footer_spacing' => 0,
		// 'css_url' => '//',
		// 'delay' => 0, // useful if css/js animation DansGame 20 sec max
		// 'dpi' => 10000, // max 10k, default 96
		// 'watermark_url' => '',
		// 'watermark_opacity' => 20, // default 20 (%)
		// 'watermark_offset_x' => 15,
		// 'watermark_offset_y' => 15,
		// 'watermark_in_background' => 1,
	];
	
	// Format url parameters
	$query = '?';
	foreach($params as $key => $value) $query .= $key.'='.urlencode($value).'&';
	$query = rtrim($query, '& ');
	
	// PDF Parameters
	$post = [
		'document_html' => '',
		'document_name' => 'Paperwork',
	];
	
	// Merge PDF parameters
	$post = array_merge($post, $properties);
	
	// cURL request
	$response = $client->request('POST', $query, [
		'form_params' => $post
	]);
	
	// Write PDF to file
	$body = $response->getBody();
	
	// Directory to save PDF in
	$id = $app->user['id'];
	$name = $properties['document_name'];
	$dir = $_ENV['STORAGE']."/{$id}/pdf/{$directory}";
	file_exists($dir) ?: mkdir($dir, 0777);
	
	$f = fopen("{$dir}/{$name}.pdf", 'w');
	fwrite($f, $body);
	fclose($f);
	
	echo $app->build->success([
		'location' => "{$app->root}/get/pdf/{$directory}/{$name}.pdf",
	]);
});