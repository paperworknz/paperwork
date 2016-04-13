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
		
		$a = $app->sql->get($table)->where('name', '=', $have)->run();
		
		return $a ? reset($a) : false; // Return the first item of $a
	}
	
	public function newJobID(){
		$app = \Slim\Slim::getInstance();
		
		// Get all jobs
		$job = $app->sql->get('job')->by('jobID ASC')->soft()->run();
		
		if($job){
			if(isset($job[0])){
				$jobID = $job[0]['jobID'] + 1;
			}else{
				$jobID = $job['jobID'] + 1;
			}
		}else{
			$jobID = $app->user['job_reference'];
		}
		
		// update uac.job_reference if necessary
		if($jobID > $app->user['job_reference']){
			$app->sql->put('master.uac')->where('uacID', '=', $app->user['uacID'])->with([
				'job_reference' => $jobID
			])->run();
		}else{
			$jobID = $app->user['job_reference'];
		}
		
		return $jobID;
		
	}
	
}