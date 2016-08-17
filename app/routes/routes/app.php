<?php

use GuzzleHttp\Client;
use Symfony\Component\Process\Process,
	Symfony\Component\HttpFoundation\Response;

$app->get('/app', 'uac', function() use ($app){
	/* Methods */
	// $client = new Client([
	// 	'base_uri' => 'http://api.pdflayer.com/api/convert',
	// ]);
	
	// /* Construction */
	// $params = [
	// 	'access_key' => '9dba89013f131f6ae8bf2280b5ab0cd2',
	// ];
	
	// $query = '?';
	// foreach($params as $key => $value) $query .= $key.'='.urlencode($value).'&';
	// $query = rtrim($query, '& ');
	
	// $post = [
	// 	'force' => 1,
	// 	'test' => 1,
	// 	'zoom' => 1,
	// 	'page_size' => 'A4',
	// 	'custom_unit' => 'mm',
	// 	'document_html' => file_get_contents('../app/app/storage/temp/cade.html'),
	// 	'document_name' => 'Enza Denino',
	// 	'margin_top' => 0,
	// 	'margin_right' => 0,
	// 	'margin_bottom' => 0,
	// 	'margin_left' => 0,
	// 	'no_hyperlinks' => 1,
	// 	'no_javascript' => 1,
	// 	'use_print_media' => 1,
	// 	'creator' => 'Paperwork.nz',
	// 	'author' => 'Paperwork.nz',
	// 	// 'page_width' => 0,
	// 	// 'page_height' => 0,
	// 	// 'inline' => 0, // inline PDF (default is to trigger download)
	// 	// 'ttl' => 5, // cache time in seconds (default 30 days (ommit this line)),
	// 	// 'header_text' => 'raw string',
	// 	// 'header_align' => 'left', // centered default,
	// 	// 'header_url' => '//',
	// 	// 'header_html' => 'raw html',
	// 	// 'header_spacing' => 0,
	// 	// 'footer_text' => 'raw string',
	// 	// 'footer_align' => 'left',
	// 	// 'footer_url' => '//',
	// 	// 'footer_html' => 'raw html',
	// 	// 'footer_spacing' => 0,
	// 	// 'viewport' => 100x100,
	// 	// 'css_url' => '//',
	// 	// 'delay' => 0, // useful if css/js animation DansGame 20 sec max
	// 	// 'dpi' => 10000, // max 10k, default 96
	// 	// Page number hottext is supported with header/footer_text, eg. [page] [frompage] [topage] [date]
	// 	// 'watermark_url' => '//'
	// 	// 'watermark_opacity' => 20, // default 20 (%)
	// 	// 'watermark_offset_x' => 15,
	// 	// 'watermark_offset_y' => 15,
	// 	// 'watermark_in_background' => 1,
	// 	// 'title' => 'string', // Max len 150
	// 	// 'subject' => '', // max len 150
	// ];
	
	// $response = $client->request('POST', $query, [
	// 	'form_params' => $post
	// ]);
	
	// $body = $response->getBody();
	
	// $f = fopen('../app/app/storage/temp/test.pdf', 'w');
	// fwrite($f, $body);
	// fclose($f);
	
	
	// // DOWNLOAD
	// $response = new Response(file_get_contents('../app/app/storage/temp/test.pdf'), 200, [
	// 	'Content-Description' => 'File Transfer',
	// 	'Content-Disposition' => 'attachment; filename="Enza Denino"',
	// 	'Content-Transfer-Encoding'	=> 'binary',
	// 	'Content-Type' => 'application/pdf'
	// ]);
	
	$app->build->page('views/app.html', [
		'modules' => [
			'app' => [],
		],
	]);
});