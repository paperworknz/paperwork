<?php

namespace Paperwork\Baked;
use \PDO,
	Paperwork\Extended\SQLBackup;

class SQL {
	
	private $result;
	
	public function __construct(){
		$this->query = [
			'db'		=> 'data',
			'method'	=> false,
			'table'		=> false,
			'data'		=> false,
			'argument'	=> false,
			'order'		=> false,
			'all'		=> false,
			'soft'		=> false,
			'softonly'	=> false,
			'purge'		=> false,
		];
	}
	
	public function post($table){
		// Need to run $table through a whitelist array provided by Astral
		$this->query['method'] = 'post';
		$this->query['table'] = $table;
		return $this;
	}
	
	public function put($table){
		// Need to run $table through a whitelist array provided by Astral
		$this->query['method'] = 'put';
		$this->query['table'] = $table;
		return $this;
	}
	
	public function get($table){
		// Need to run $table through a whitelist array provided by Astral
		$this->query['method'] = 'get';
		$this->query['table'] = $table;
		return $this;
	}
	
	public function delete($table){
		// Need to run $table through a whitelist array provided by Astral
		$this->query['method'] = 'delete';
		$this->query['table'] = $table;
		return $this;
	}
	
	public function touch($table){
		$this->query['method'] = 'touch';
		$this->query['table'] = $table;
		return $this;
	}
	
	public function with($data){
		// Need to run $column through a whitelist array provided by Astral
		$this->query['data'] = $data;
		return $this;
	}
	
	public function where($column, $operator, $value){
		// Need to run $key, $operator through a whitelist array provided by Astral
		$this->query['argument'] = [
			'column' => $column,
			'operator' => $operator,
			'value' => $value
		];
		return $this;
	}
	
	public function by($table){
		$this->query['order'] = 'ORDER BY '.$table;
		return $this;
	}
	
	public function all(){
		$this->query['all'] = true;
		return $this;
	}
	
	public function soft(){
		$this->query['soft'] = true;
		return $this;
	}
	
	public function softOnly(){
		$this->query['softonly'] = true;
		return $this;
	}
	
	public function purge(){
		$this->query['purge'] = true;
		return $this;
	}
	
	public function run(){
		$app = \Slim\Slim::getInstance();
		$backup = new SQLBackup;
		
		if(strpos($this->query['table'], '.') !== false){ // If a dot is found, the user is now using table master
			$this->query['db'] = 'master';
			$this->query['table'] = str_replace('master.', '', $this->query['table']);
		}
		
		// SQLBackup only if this change is for a user's database
		switch($this->query['method']){
			case 'post':
				$this->runPost($app);
				break;
			case 'put':
			case 'touch':
				$this->runPut($app);
				break;
			case 'get':
				$this->runGet($app);
				break;
			case 'delete':
				$this->runDelete($app);
				break;
		}
		$this->query = [
			'db'		=> 'data',
			'method'	=> false,
			'table'		=> false,
			'data'		=> false,
			'argument'	=> false,
			'order'		=> false,
			'all'		=> false,
			'soft'		=> false,
			'softonly'	=> false,
			'purge'		=> false,
		];
		if(isset($this->result)) return $this->result;
		
		// SQLBackup after result is returned to avoid post returning the
		// subsequent eventID's ID! (SQLBackup logs an event as a sql->post)
		switch($this->query['method']){
			case 'post':
			case 'put':
			case 'delete':
				// use backup(true) for dev testing
				if($this->query['db'] != 'master') $backup->backup();
				break;
		}
	}
	
	protected function runPost($app){
		$db = $this->query['db'];
		$this->query['data']['date_created'] = date("Y-m-d H:i:s");
		$this->query['data']['date_touched'] = date("Y-m-d H:i:s");
		$data = $this->query['data'];
		$values = [];
		
		$sql = 'INSERT INTO ';
		$sql .= $this->query['table'];
		$sql .= ' ';
		
		$a = count($data);
		$b = $p = '';
		for($i = 0; $i<$a; $i++){$b .= '?,';}
		foreach ($data as $key => $pair){
			$p .= $key.',';
			$values[] = $pair;
		}
		$b = trim($b, ',');
		$p = trim($p, ',');
		$sql .= "({$p}) VALUES ({$b})";
		
		try {
			$stmt = $app->pdo->$db->prepare($sql);
			$stmt->execute($values);
			$this->result = $app->pdo->$db->lastInsertID();
		}catch(Exception $e){
			return false;
		}
		
		return;
	}
	
	protected function runPut($app){
		$db = $this->query['db'];
		$this->query['data']['date_touched'] = date("Y-m-d H:i:s");
		$data = $this->query['data'];
		$column = $this->query['argument']['column'];
		$operator = $this->query['argument']['operator'];
		$value = $this->query['argument']['value'];
		
		$sql = 'UPDATE ';
		$sql .= $this->query['table'];
		$sql .= ' SET ';
		
		$p = '';
		$values = [];
		foreach($data as $key => $pair){ // Create string for sql
			$placeholder = ':'.$key; // :name, :address
			$p .= $key.'='.$placeholder.','; // name=:name,address=:address,
			$values[$placeholder] = $pair; // ':name' => 'Cade', ':address' => '105 Swamp Road'
		}
		$p = trim($p, ','); // Remove trailing comma
		
		$sql .= "{$p} WHERE {$column} {$operator} '{$value}'";
		
		try {
			$stmt = $app->pdo->$db->prepare($sql);
			$stmt->execute($values);
			return;
		}catch(Exception $e){
			return;
		}
	}
	
	// PERMANENT DELETE
	/*protected function runDelete($app){
		$db = $this->query['db'];
		$column = $this->query['argument']['column'];
		$operator = $this->query['argument']['operator'];
		$value = $this->query['argument']['value'];
		
		$sql = 'DELETE FROM ';
		$sql .= $this->query['table'];
		
		try {
			$sql .= " 
			WHERE 
			{$column} {$operator} '{$value}'";
			$stmt = $app->pdo->$db->prepare($sql);
			$stmt->execute();
			return;
		}catch(Exception $e){
			return;
		}
	}*/
	
	protected function runDelete($app){
		$db = $this->query['db'];
		$column = $this->query['argument']['column'];
		$operator = $this->query['argument']['operator'];
		$value = $this->query['argument']['value'];
		
		if($this->query['purge']){
			$sql = 'DELETE FROM ';
			$sql .= $this->query['table'];
		}else{
			$sql = 'UPDATE ';
			$sql .= $this->query['table'];
			$sql .= ' SET date_deleted="'.date("Y-m-d H:i:s").'"';
			$sql .= ',date_touched="'.date("Y-m-d H:i:s").'"';
		}
		
		try {
			$sql .= " 
			WHERE 
			{$column} {$operator} '{$value}'";
			$stmt = $app->pdo->$db->prepare($sql);
			$stmt->execute();
			return;
		}catch(Exception $e){
			die($e);
		}
	}
	
	protected function runGet($app){
		$db		= $this->query['db'];
		$table	= $this->query['table'];
		$param	= $this->query['argument'] ? true : false;
		$order	= $this->query['order'] ? $this->query['order'] : '';
		
		if($param){
			$column = $this->query['argument']['column'];
			$operator = $this->query['argument']['operator'];
			$value = $this->query['argument']['value'];
		}
		
		/** Phase 1: Create an Array of the database table **/
		$sql = "SELECT * FROM {$table} ";
		
		if(!$this->query['soft'] && !$this->query['softonly']){ // No soft/softOnly flag so return without soft
			// return selected or all, excluding softs
			$sql .= $param ? "WHERE {$column} {$operator} '{$value}' AND date_deleted='0000-00-00 00:00:00' " : "WHERE date_deleted='0000-00-00 00:00:00' ";
		}else{ // Soft or softOnly flag
			if($this->query['soft']){ // Include softs
				if($param) $sql .= "WHERE {$column} {$operator} '{$value}' "; // Return all = don't exclude softs
			}
			if($this->query['softonly']){
				// return selected or all, only where soft date has been set
				$sql .= $param ? "WHERE {$column} {$operator} '{$value}' AND date_deleted<>'0000-00-00 00:00:00' " : "WHERE date_deleted<>'0000-00-00 00:00:00' ";
			}
		}
		
		$sql .= $order;
		$data = $app->pdo->$db->query($sql)->fetchAll(PDO::FETCH_ASSOC);
		
		
		/** Phase 2: Iterate through the array and find any foreign keys that needs translating **/
		$schema = $app->schema['dbschema'];
		foreach($schema as $key => $value){
			if($value == $table)
				$self = [
					'ID'	=> $key,
					'table'	=> $value
				]; // Create array 'self' to store the ID for the host table eg. 'ID' => jobID, 'table' => 'job' <--- this does not get translated
		}

		foreach($data as $key => $pair){ // Iterate through all arrays of data found
			$temp = $key;
			foreach($pair as $key => $pair){ // Iterate through each datum in each array
				if(strpos($key, 'ID') && $key != $self['ID']){ // Find a key that has 'ID' in it, and is not the host root table
					$suspect = $schema[$key]; // $suspect = $schema[$key] = $schema['jobID'] = 'job'
					
					$a = $app->pdo->$db->query("
						SELECT
						*
						FROM
						{$suspect}
						WHERE
						{$key} = {$pair}
					")->fetch(PDO::FETCH_ASSOC); // Make an array of the ID to be translated
					
					$keylite = str_replace('ID', '', $key); // Remove 'ID' from the key 'clientID'
					$data[$temp][$keylite] = $a; // Create new key with the natural name eg 'client' -> job['client']['clientID'] = 1;
					unset($data[$temp][$key]); // Remove the old key which was equal to the ID number
				}
			}
		}
		
		if(!$this->query['all']){
			foreach($data as $datum){
				$data = $datum;
			}
		}
		
		$this->result = $data;
		return;
	}
	
}