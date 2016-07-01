<?php

namespace Paperwork\Baked;

use \PDO,
	Paperwork\Extended\SQLBackup;

class SQL {
	
	protected static $config = [
		'host'		=> '127.0.0.1',
		'database'	=> 'paperwork',
		'user'		=> 'root',
		'password'	=> '',
		'cache'		=> true,
		'logging'	=> false,
		'logger'	=> false,
	];
	
	protected $pdo;
	protected $query;
	protected $statement = [];
	
	protected $cache = [];
	protected $log = [
		'query'	=> null,
		'time'	=> null,
	];
	
	public function __construct(){
		$app = \Slim\Slim::getInstance();
		
		$this->pdo = new PDO(
			'mysql:host='.self::$config['host'].';dbname='.self::$config['database'],
			self::$config['user'],
			self::$config['password']
		);
		
		$this->query = [
			'root'		=> false,
			'method'	=> false,
			'select'	=> [],
			'distinct'	=> false,
			'table'		=> false,
			'values'	=> false,
			'where'		=> [],
			'also'		=> [],
			'hard'		=> false,
			'event'		=> false,
			'return'	=> false,
			'soft'		=> false,
			'raw'		=> false,
		];
		
	}
	
	// CONFIGURE //
	
	public static function configure($array){
		foreach($array as $a => $b){
			self::$config[$a] = $b;
		}
	}
	
	// METHODS //
	
	public function get($table){
		$this->query['method'] = 'get';
		$this->query['table'] = $table;
		return $this;
	}
	
	public function post($table){
		$this->query['method'] = 'post';
		$this->query['table'] = $table;
		return $this;
	}
	
	public function put($table){
		$this->query['method'] = 'put';
		$this->query['table'] = $table;
		return $this;
	}
	
	public function delete($table){
		$this->query['method'] = 'delete';
		$this->query['table'] = $table;
		return $this;
	}
	
	public function touch($table){
		$this->query['method'] = 'touch';
		$this->query['table'] = $table;
		return $this;
	}
	
	// SELECT //
	
	public function select($values){
		if(is_array($values)){
			$this->query['select'] = $values;
		}else{
			$this->query['select'] = [];
			$this->query['select'][0] = $values;
		}
		return $this;
	}
	
	// CONDITION //
	
	public function where($column, $operator, $values, $conjunction = '*'){
		
		if(is_array($values)){
			$string = '';
			
			foreach($values as $value){
				if(is_string($value)){
					$value = '"'.$value.'"';
				}
				$string .= $value.',';
			}
			
			$string = '('.trim($string, ',').')';
		}else{
			
			$par = substr_count($values, ')');
			$values = str_replace(')', '', $values);
			
			if(is_string($values)) $values = '"'.$values.'"';
			
			for($i=0;$i<$par;$i++){
				$values .= ')';
			}
			
			$string = $values;
			
		}
		
		array_push($this->query['where'], [
			'conjunction' => $conjunction,
			'column' => $column,
			'operator' => $operator,
			'values' => $string,
		]);
		
		return $this;
	}
	
	public function and($column, $operator, $values){
		$conjunction = 'AND';
		$this->where($column, $operator, $values, $conjunction);
		return $this;
	}
	
	public function or($column, $operator, $values){
		$conjunction = 'OR';
		$this->where($column, $operator, $values, $conjunction);
		return $this;
	}
	
	public function soft(){
		$this->query['soft'] = true;
		return $this;
	}
	
	public function softOnly(){
		$this->query['soft'] = true;
		$conjunction = '*';
		$this->where('date_deleted', '<>', '0000-00-00 00:00:00', $conjunction);
		return $this;
	}
	
	public function hard(){
		$this->query['hard'] = true;
		return $this;
	}
	
	// PUT VALUES //
	
	public function with($values){
		$this->query['values'] = $values;
		return $this;
	}
	
	// MISC //
	
	public function distinct(){
		$this->query['distinct'] = true;
		return $this;
	}
	
	public function also($what){
		array_push($this->query['also'], $what);
		return $this;
	}
	
	public function event(){
		$this->query['event'] = true;
		return $this;
	}
	
	public function root(){
		$this->query['root'] = true;
		return $this;
	}
	
	public function raw($statement){
		$this->query['raw'] = $statement;
		return $this->run();
	}
	
	// RESULT //
	
	public function one(){
		$this->query['return'] = 'one';
		return $this->run();
	}
	
	public function all(){
		$this->query['return'] = 'all';
		return $this->run();
	}
	
	// RUN //
	
	public function run(){
		$app = \Slim\Slim::getInstance();
		
		// Raw
		if($this->query['raw']){
			$this->log['query'] .= $this->query['raw'].PHP_EOL;	// Log SQL statement
			$query = $this->pdo->query($this->query['raw']);	// Query SQL statement
			
			if(!$query){
				dd($this->log); // If fail, die and dump the SQL log
			}else{
				$data = $query->fetchAll(PDO::FETCH_ASSOC); // Execute statement
				return $data;
			}
		}
		
		
		// Query over all users, or by user_id
		if(!$this->query['root']){
			if(isset($app->user['id'])){
				if($this->query['method'] == 'post') $this->query['values']['user_id'] = $app->user['id'];
				$this->where('user_id', '=', $app->user['id'], '*');
			}else{
				$this->log = 'ERROR: user_id is absent'; // @@@@@@@@@@@@@@@@ NEEDS HANDLING
				echo $this->log;
				die();
			}
		}
		
		// Soft delete
		if(!$this->query['soft'] && !$this->query['hard']) $this->where('date_deleted', '=', '0000-00-00 00:00:00', '*');
		
		// Instantiate the result variable
		$start	= microtime(true); // Start clock
		$result = false;
		$method	= $this->query['method']; // Cache method
		$event 	= $this->query['event']; // Cache log
		
		// Run appropriate function using $this->query
		switch($this->query['method']){
			case 'get':
				$result = $this->runGet($app); // sets $result as array of result
				break;
			case 'post':
				$result = $this->runPost($app); // sets $result as new ID number
				break;
			case 'put':
			case 'touch':
				$this->runPut($app); // does not set $result
				break;
			case 'delete':
				$this->runDelete($app); // does not set $result
				break;
		}
		
		$this->statement = [];
		$this->query = [
			'root'		=> false,
			'method'	=> false,
			'select'	=> [],
			'distinct'	=> false,
			'table'		=> false,
			'values'	=> false,
			'where'		=> [],
			'also'		=> [],
			'hard'		=> false,
			'event'		=> false,
			'return'	=> false,
			'soft'		=> false,
			'raw'		=> false,
		];
		
		$end = microtime(true); // End clock
		$this->log['time'] = round($end - $start, 2);
		
		if(self::$config['logging'] != false && is_callable(self::$config['logger'])){
			call_user_func(self::$config['logger'], $this->log);
		}
		
		$this->log = [
			'query' => null,
			'time' => null,
		];
		
		// Return result
		if($result !== false && $event == false) return $result;
		
	}
	
	// QUERY BUILDER HELPER //
	
	private function add($shard){
		array_push($this->statement, $shard);
	}
	
	private function addConditions(){
		// WHERE //
		if($this->query['where']){
			
			// Cycle through all where arrays
			foreach($this->query['where'] as $clause){
				
				// If a where.conjunction = * (soft, softOnly use * wildcard)
				if($clause['conjunction'] == '*'){
					$clause['conjunction'] = 'WHERE'; // Default to WHERE
					foreach($this->statement as $shard){
						if($shard === 'WHERE'){
							$clause['conjunction'] = 'AND'; // Change to AND if a WHERE is present
						}
					}
				}
				
				$this->add($clause['conjunction']);
				$this->add($clause['column']);
				$this->add($clause['operator']);
				$this->add($clause['values']);
			}
		}
		
		// ALSO //
		
		if($this->query['also']){
			foreach($this->query['also'] as $clause){
				$this->add($clause);
			}
		}
	}
	
	// QUERY BUILDER //
	
	protected function runPost($app){
		
		$this->add('INSERT INTO');
		$this->add($this->query['table']);
		
		// VALUES //
		
		$this->query['values']['date_created'] = date("Y-m-d H:i:s");
		$this->query['values']['date_touched'] = date("Y-m-d H:i:s");
		$count = count($this->query['values']);
		$columns = $values = '';
		$data = [];
		
		// 'blue','red','purple',
		foreach ($this->query['values'] as $key => $pair){
			$columns .= $key.',';
			$data[] = $pair;
		}
		
		// ?,?,?,
		for($i = 0; $i < $count; $i++){
			$values .= '?,';
		}
		
		$values = trim($values, ',');	// Remove trailing commas
		$columns = trim($columns, ',');	// Remove trailing commas
		
		$this->add('('.$columns.')');
		$this->add('VALUES');
		$this->add('('.$values.')');
		
		// CONSTRUCT STATEMENT //
		
		$sql = '';
		foreach($this->statement as $shard){
			$sql .= trim($shard, ' ').' ';
		}
		
		$this->log['query'] .= $sql.PHP_EOL;	// Log SQL statement
		$query = $this->pdo->prepare($sql);		// Query SQL statement
		
		if(!$query){
			dd($this->log); // If fail, die and dump the SQL log
		}else{
			$query->execute($data);
		}
		
		return $this->pdo->lastInsertID(); // Return post ID
	}
	
	protected function runPut($app){
		
		$this->add('UPDATE');
		$this->add($this->query['table']);
		$this->add('SET');
		
		// VALUES //
		
		$this->query['values']['date_touched'] = date("Y-m-d H:i:s");
		$columns = '';
		$data = [];
		
		foreach($this->query['values'] as $key => $pair){
			$placeholder = ':'.$key; // :name, :address
			$columns .= $key.'='.$placeholder.','; // name=:name,address=:address,
			$data[$placeholder] = $pair; // ':name' => 'Cade', ':address' => '105 Swamp Road'
		}
		
		$columns = trim($columns, ',');	// Remove trailing comma
		$this->add($columns);			// name=:name,address=:address
		$this->addConditions();			// WHERE, ALSO
		
		// CONSTRUCT STATEMENT //
		
		$sql = '';
		foreach($this->statement as $shard){
			$sql .= trim($shard, ' ').' ';
		}
		
		$this->log['query'] .= $sql.PHP_EOL;	// Log SQL statement
		$query = $this->pdo->prepare($sql);		// Query SQL statement
		
		if(!$query){
			dd($this->log); // If fail, die and dump the SQL log
		}else{
			$query->execute($data);
		}
		
		return; // Return nothing
	}
	
	protected function runDelete($app){
		
		if(!$this->query['hard']){
			$this->query['values'] = [
				'date_deleted' => date("Y-m-d H:i:s"),
				'date_touched' => date("Y-m-d H:i:s"),
			];
			return $this->runPut($app);
		}
		
		$this->add('DELETE FROM');
		$this->add($this->query['table']);
		$this->addConditions();
		
		// CONSTRUCT STATEMENT //
		
		$sql = '';
		foreach($this->statement as $shard){
			$sql .= trim($shard, ' ').' ';
		}
		
		$this->log['query'] .= $sql.PHP_EOL;	// Log SQL statement
		$query = $this->pdo->prepare($sql);		// Query SQL statement
		
		if(!$query){
			dd($this->log);
		}else{
			$query->execute();
		}
		
		return; // Return nothing
	}
	
	protected function runGet($app){
		
		/** Phase 1: Create an Array of the database table **/
		
		// SELECT //
		$this->add('SELECT');
		
		if($this->query['distinct']){
			$this->add('DISTINCT');
		}
		
		if(!$this->query['select']){
			if(!$this->query['distinct']){
				$this->add('*');
			}
			$this->add('FROM');
			$this->add($this->query['table']);
			
		}else{
			$list = '';
			foreach($this->query['select'] as $select){
				$list .= $select.',';
			}
			$list = trim($list, ','); // Remove trailing comma
			
			$this->add($list);
			$this->add('FROM');
			$this->add($this->query['table']);
		}
		
		// WHERE, ALSO //
		
		$this->addConditions();
		
		// CONSTRUCT STATEMENT //
		
		$sql = '';
		foreach($this->statement as $shard){
			$sql .= trim($shard, ' ').' ';
		}
		$sql = trim($sql, ' ');
		
		$this->log['query'] .= $sql; // Log SQL statement
		
		$query = $this->pdo->query($sql); // Query SQL statement
		
		if(!$query){
			dd($this->log); // If fail, die and dump the SQL log
		}else{
			$data = $query->fetchAll(PDO::FETCH_ASSOC); // Execute statement
			$this->cache[$sql] = $data; // Cache the SQL statement + the data
		}
		
		
		/** Phase 2: Iterate through the array and audit foreign keys **/
		$foreign = [];
		
		foreach($data as $key => $pair){ // Iterate through all arrays of data found
			$index = $key; // cache root key
			
			foreach($pair as $a => $b){ // Iterate through each array of data
				if(strpos($a, 'id') // column name contains 'id'
					&& $a != 'id' // Ignore 'id' (primary key)
						&& $a != 'user_id' // Ignore 'user_id'
							&& $a != $this->query['table'].'_id'){ // ignore ::self_id
					
					$column = $a;
					$value = $b;
					
					if(!isset($foreign[$column])) $foreign[$column] = [];
					array_push($foreign[$column], $value);
				}
			}
		}
		
		/** Phase 3: Iterate through foreign key audit and build a query **/
		
		// Remove duplicates from foreign key audit
		foreach($foreign as $column => $values){
			$foreign[$column] = array_unique($foreign[$column]);
		}
		
		// Iterate through foreign keys
		foreach($foreign as $column => $values){
			
			$table = str_replace('_id', '', $column);
			
			$sql = "SELECT * FROM {$table} WHERE id IN (";
			$list = '';
			
			foreach($values as $id){
				$list .= $id.',';
			}
			
			$list = trim($list, ',');
			
			$sql .= $list.')';
			
			if(!$this->query['root']){
				if(isset($app->user['id'])){
					$sql .= ' AND user_id='.$app->user['id'];
				}
			}
			
			$this->log['query'] .= PHP_EOL.' - '.$sql;
			
			$join = $this->pdo->query($sql); // Query SQL statement
			
			// Make an array of the ID to be translated
			if(!$join){
				dd('Foreign join failed: '.$join); // If fail, die and dump the SQL statement
			}else{
				$return = $join->fetchAll(PDO::FETCH_ASSOC); // Execute statement
				//$this->cache[$sql] = $return; // Cache the SQL statement + the data
			}
			
			foreach($data as $a => $b){
				$id = $b[$column];
				
				foreach($return as $alien){
					
					if($alien['id'] == $id){
						$data[$a][$table] = $alien;
						unset($data[$a][$column]);
					}
					
				}
			}
			
		}
		
		if($this->query['return'] == 'one'){
			if(count($this->query['select']) === 1){ // If selecting only ID
				if(isset($data[0]))	$data = $data[0]; // Return single integer of ID
			}
			foreach($data as $datum){
				$data = $datum;
			}
		}
		
		return $data; // Return data array
	}
	
}