var Table = (function($, environment){
	
	var map;
	
	const $table = $('.wt-table'),
		$row = $table.find('.wt-row'),
		$column = $table.find('.wt-column'),
		$filter = $table.find('.wt-filter'),
		$reset = $table.find('.wt-reset');
	
	const config = {
		filter: 'All',
		width: {
			ID: '44px',
			Name: '260px',
			Client: '165px',
			Status: '111px',
		}
	};
	
	// Binds
// Hover table rows
$row.on('mouseover', hover);
$row.on('mouseout', hover);

// Reset Changes
$reset.on('click', reset);

// When a row is clicked, goto(href)
$row.on('click', function(){
	goto($(this).attr('href'));
});

// Click column head to run state()
$table.find('[wt-head]').on('click', function(){
	let id = $(this).closest('.wt-column').attr('data-id'),
		$head = $(this).closest('.wt-head');
	state(id, $head);
});

// Run filter() when filter select is changed
$filter.on('change', function(){
	let value = $(this).val();
	filter(value);
	render();
});

// The following two functions do not re-render the table
// and are non-crucial

// Resizable columns (horizontally) 
if(interact != undefined){
	interact('.wt-column').resizable({
		edges: {
			right: true
		}
	}).on('resizemove', function(event){
		let target = event.target,
			id = $(target).attr('data-id'),
			width = event.rect.width + 'px';
		
		target.style.width = width; // Update css width
		map.columns[id].width = width; // Update map
		setMap(); // Save map
		
	}).allowFrom('.wt-head');
}

// Rearrangable columns (horizontally)
if(Sortable != undefined){
	new Sortable(document.getElementById('sortable'), {
		handle: '.wt-head',
		animation: 150,
		ghostClass: 'wt-column-ghost',
		onEnd: function(event){
			$('.wt-column').each(function(event){
				map.columns[$(this).attr('data-id')].index = event;
				setMap();
			});
		}
	});
}
	
	// Methods
function hover(state){
	let row = this.attributes['data-row'].value;
	$table.find(`[data-row="${row}"]`).toggleClass('wt-row-hover');
}
function getMap(){
	if(localStorage.map){
		map = JSON.parse(localStorage.map);
		return;
	}
	
	let filter = config.filter ? config.filter : 'All'; // Default status: 'All';
	
	map = {
		filter: filter,
		columns: {},
	};
	
	$column.each(function(index){
		let id = this.attributes['data-id'].value,
			width = config.width[id] ? config.width[id] : ''; // Detault width: '';
		
		map.columns[id] = {
			index: index,
			state: 'def',
			stateOrder: index,
			width: width,
		};
	});
	
	setMap();
}

function setMap(){
	if(!localStorage){
		console.warn('Unable to save map to localStorage');
		return;
	}
	
	localStorage.map = JSON.stringify(map);
}
function state(id, $head){
	var state = $head.attr('data-state'),
		order = [];
	
	// order as stateOrder
	for(let i in map.columns){
		const value = map.columns[i];
		order[value.stateOrder] = i;
	}
	
	// Move clicked item to front of stateOrder
	if(state != 'desc'){
		order = moveTo(order, id, 0);
	}else{
		order = moveTo(order, id, 'end');
	}
	
	// Increment state
	switch(state){
		case 'asc':
			state = 'desc';
			map.columns[id].state = state;
			break;
		
		case 'desc':
			state = 'def';
			map.columns[id].state = state;
			break;
		
		case 'def':
			state = 'asc';
			map.columns[id].state = state;
			break;
	}
	
	// Update map based off new stateOrder
	for(let i in map.columns){
		const value = map.columns[i];
		let position = order.indexOf(i);
		
		map.columns[i].stateOrder = position;
	}
	
	setMap();
	render();
	
	function moveTo(array, item, to){
		var index = array.indexOf(item);
		
		if(index === -1) throw new Error("Element not found in array");
		if(to < 0) to = 0;
		if(to == 'end') to = array.length + 1;
		
		array.splice(index, 1);
		array.splice(to, 0, item);
		
		return array;
	}
}
function render(){
	var order = [],
		index = [];
	
	// Filter rows
	$filter.val(map.filter);
	if(map.filter == 'All'){
		$row.show();
	}else{
		$row.hide();
		$column.filter('[data-id="Status"]').find('.wt-row').each(function(){
			if($(this).text() == map.filter){
				let id = this.attributes['data-row'].value;
				
				$row.each(function(){
					if(this.attributes['data-row'].value == id) $(this).show();
				});
			}
		});
	}
	
	
	// Set Index for each column
	index = (function(columns){
		for(let i in columns){
			const value = columns[i];
			index[value.index] = $column.filter(`[data-id="${i}"]`);
		}
		
		return index; // [4: $(column), ...]
	})(map.columns);
	
	for(let i in index){
		const value = index[i];
		$('.wt-wrap').append(value);
	}
	
	
	// Set sort arrangement for each column
	order = (function(columns){
		// Column ID's in stateOrder: [Status, Client, Name, ...];
		for(let i in columns){
			const value = columns[i];
			order[value.stateOrder] = i;
		}
		
		return order.reverse(); // Sort 4, 3, 2...
	})(map.columns);
	
	// Apply sort function in order from first to last
	for(let i in order){
		const value = order[i];
		let $col = $column.filter(`[data-id="${value}"]`);
		
		if(map.columns[value].state == 'asc'){
			$col.find('img').css('display', 'block');
			$col.find('img').attr('src', environment.root+'/css/app/media/up.png');
			$col.find('.wt-head').attr('data-state', 'asc');
			sort(value, 'asc');
		}else if(map.columns[value].state == 'desc'){
			$col.find('img').css('display', 'block');
			$col.find('img').attr('src', environment.root+'/css/app/media/down.png');
			$col.find('.wt-head').attr('data-state', 'desc');
			sort(value, 'desc');
		}else if(map.columns[value].state == 'def'){
			$col.find('img').css('display', 'none');
			$col.find('.wt-head').attr('data-state', 'def');
			sort(value, 'def');
		}
	}
	
	
	// Row width
	
	for(let i in map.columns){
		const value = map.columns[i];
		$column.filter(`[data-id=${i}]`).css('width', value.width);
	}
	
	// Display table
	$table.css('display', 'block');
}

function sort(id, state){
	var column = `.wt-column[data-id="${id}"]`,
		$rows = $(column).find('.wt-row'),
		order = [];
	
	switch(state){
		case 'def':
			tinysort(`${column} .wt-row`, {
				attr: 'data-row'
			});
			break;
		
		case 'asc':
			tinysort(`${column} .wt-row`, {
				order: 'asc'
			});
			break;
		
		case 'desc':
			tinysort(`${column} .wt-row`, {
				order: 'desc'
			});
			break;
	}
	
	$(`.wt-column[data-id="${id}"] .wt-row`).each(function(){
		order.push($(this).attr('data-row'));
	});
	
	$column.each(function(){
		let $col = $(this);
		
		if($(this).attr('data-id') != id){
			let col_map = {};
			
			$(this).find('.wt-row').each(function(){
				col_map[$(this).attr('data-row')] = $(this);
			});
			
			for(let i = 0, l = order.length; i < l; i++){
				if(col_map[order[i]]){
					$col.append(col_map[order[i]]);
				}
			}
		}
	});
}
function filter(filter){
	
	if(!$filter.find(`[value="${filter}"]`).length){
		console.warn('Filter unavailable');
		return;
	}
	
	map.filter = filter;
	setMap();
}
	
	// API
	function configure(data){
		
		if(!data){
			console.warn('No configuration supplied');
			return false;
		}
		
		getMap();
		
		// Filter
		if(data.filter) filter(data.filter);
		
		// Width
		if(data.width){
			for(let i in data.width){
				const value = data.width[i];
				if(config.width[i]) config.width[i] = value;
			}
		}
		
		run();
	}
	
	function run(){
		getMap();
		render();
	}
	
	function reset(){
		if(localStorage) delete localStorage.map;
		run();
	}
	
	return {
		configure: configure,
		run: run,
		reset: reset,
	};
	
})(jQuery, environment);