<?php

namespace Paperwork\Extended;
use \PDO;

class ID {
	
	public function translateID($need, $have){ // Function to translate a value into it's ID
		$app = \Slim\Slim::getInstance();
		
		$schema = $app->schema['dbschema']; // Load SQL relationships array
		
		/** Phase 1: Work out which table we're working with from what they need **/
		foreach($schema as $key => $value){ // Create array ID to store the ID for the host table
			if($key == $need)
				$ID = [
					'ID' => $key,
					'table' => $value
				]; // ID is the schema for our host table eg. 'ID' => 'typeID', 'table' => 'inv_type'
		}
		
		/** Phase 2: Translate the query **/
		$value = $ID['ID'];
		$table = $ID['table'];
		$a = $app->pdo->data->query("
			SELECT
			*
			FROM
			{$table}
			WHERE
			name = '{$have}'
		")->fetch(PDO::FETCH_ASSOC);
		
		if($a){
			return $value = reset($a); // Return the first item of $a which is what the user wants
		}else{
			return false;
		}
		
	}
	
	public function newJobID(){
		$app = \Slim\Slim::getInstance();
		
		// Use $data to get the latest JobID from db job
		$data = $app->pdo->data->query("
			SELECT
			jobID
			FROM
			job
			ORDER BY 
			jobID DESC
			LIMIT 1
		")->fetchColumn();
		
		if($data){
			// Strip away any non-numeric characters to get the jobID
			// Increase jobID by one and patch it back together
			preg_match_all('!\d+!', $data, $jobID);
			$jobID = $jobID[0][0] + 1;
			return $jobID;
		}else{
			return $jobID = '1000'; // <------------------------------ STATIC!
		}
	}
	
}