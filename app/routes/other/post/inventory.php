<?php

$app->post('/post/inventory', 'uac', function() use ($app){
	/* Methods */
	
	/* Construction */
	// Get Excel sheet
	$file	= $_FILES['file']['tmp_name'];
	
	//  Read or die
	try {
		$inputFileType = PHPExcel_IOFactory::identify($file);
		$objReader = PHPExcel_IOFactory::createReader($inputFileType);
		$objPHPExcel = $objReader->load($file);
	} catch(Exception $e) {
		die('Error loading file "'.pathinfo($file,PATHINFO_BASENAME).'": '.$e->getMessage());
	}
	
	// Turn into an array of sheets
	$sheet = $objPHPExcel->getActiveSheet()->toArray(null,true,true,true);
	
	// Managed array
	$data = [];
	
	// Updated array
	try {
		foreach($sheet as $a){
			if(is_string($a['A'])){
				$name = $a['A'];
				$price = isset($a['B']) ? $a['B'] : '0.00';
				$data[$name] = $price;
			}
		}
	}Catch(Exception $e){
		die($e);
	}
	
	// Build inventory page
	$app->build->page('views/inventory.html', [
		'inv_type'	=> $app->sql->get('inv_type')->run(),
		'inv'		=> $app->sql->get('inv')->run(),
		'bulk'		=> json_encode($data)
	]);
});