<?php

namespace Paperwork\Extended;

class Document {
	
	public function get($documents){
		$app = \Slim\Slim::getInstance();
		
		$document;
		
		foreach($documents as $value){
			$document_id = $value['id'];
			$job_number = $value['job']['job_number'];
			$client_name = $value['client']['name'];
			$client_address = $value['client']['address'];
			
			unset(
				$value['id'],
				$value['user_id'],
				$value['user_template'],
				$value['client'],
				$value['job'],
				$value['html'],
				$value['date_created'],
				$value['date_touched'],
				$value['date_deleted']
			);
			
			$value['items'] = $app->parse->jsonToArray($value['items']);
			
			if(isset($value['items']['items'])){
				$value['items'] = $value['items']['items'];
			}
			
			$value['id'] = $job_number;
			$value['client-name'] = $client_name;
			$value['client-address'] = $client_address;
			
			$document[$document_id] = $value;
		}
		
		return $document;
	}
}