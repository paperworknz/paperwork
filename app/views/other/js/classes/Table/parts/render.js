function render(){
	var order = [],
		index = [],
		filters;
	
	// Filter options
	filters = getFilters();
	for(let i in filters){
		const value = filters[i];
		
		if(!$filter.find(`option[value="${i}"]`).length){
			$filter.append(`
				<option value="${i}">
					${i}
				</option>
			`);
		}
	}
	
	// Filter rows
	$filter.val(map.filter);
	if(map.filter == 'All'){
		$row.show();
	}else{
		let statuses = [];
		
		// Hide all
		$row.hide();
		
		// Check if filter is a status name, or a custom filter
		if(filters[map.filter]){
			statuses = filters[map.filter].status;
		}else{
			statuses[0] = map.filter;
		}
		
		$column.filter('[data-id="Status"]').find('.wt-row').each(function(){
			if(statuses.indexOf($(this).text()) !== -1){
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
		$table.find('.wt-wrap').append(value);
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
			$col.find('img').attr('src', environment.root+'/css/media/up.png');
			$col.find('.wt-head').attr('data-state', 'asc');
			sort(value, 'asc');
		}else if(map.columns[value].state == 'desc'){
			$col.find('img').css('display', 'block');
			$col.find('img').attr('src', environment.root+'/css/media/down.png');
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
	
	$table.find(`.wt-column[data-id="${id}"] .wt-row`).each(function(){
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