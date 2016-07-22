var Table = (function($, environment){
	
	var map,
		filters;
	
	var $table;
	
	if(!$('.wt-table').length < 0) return;
	
	$('.wt-table').each(function(){
		if(!$(this).data('id')){
			$(this).attr('data-id', Paperwork.random(6));
			$table = $(this);
		}
	});
	
	const $row = $table.find('.wt-row'),
		$column = $table.find('.wt-column'),
		$filter = $table.find('.wt-filter'),
		$settings = $table.find('.wt-settings');
	
	const config = {
		filter: 'All',
		width: {
			ID: '44px',
			Name: '260px',
			Client: '165px',
			Status: '111px',
		}
	};
	
	run();
	
	// Binds
function bind(){

	// Hover table rows
	$row.on('mouseover', hover);
	$row.on('mouseout', hover);

	// Reset Changes
	$settings.on('click', newFilter);

	// When a row is clicked, Paperwork.goto(href)
	$row.on('click', function(){
		Paperwork.goto($(this).attr('href'));
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
function filter(filter){
	
	if(!filter) filter = 'All';
	if(!$filter.find(`[value="${filter}"]`).length) console.warn(`Filter ${filter} unavailable`);
	
	map.filter = filter;
	setMap();
}

function getFilters(){
	
	if(!localStorage) return console.warn('Unable to access localStorage');
	
	// Make empty object if no filters exist
	if(!localStorage.filter) localStorage.filter = JSON.stringify({});
	
	// Return filter object
	return JSON.parse(localStorage.filter);
}

function pushFilter(name, filter){
	
	let filters = getFilters();
	
	if(!typeof name === 'string') return console.warn('No filter name given for new filter');
	
	// Set filter by name (may override)
	filters[name] = filter;
	
	// Store filter in localStorage
	localStorage.filter = JSON.stringify(filters);
}

function removeFilter(name){
	
	let filters = getFilters();
	
	if(filters[name]) delete filters[name];
	
	localStorage.filter = JSON.stringify(filters);
}
function newFilter(){
	
	// Paperwork.dark();
	var d = Paperwork.dark(),
		dark_container = d.object,
		fade = d.object.find('.dark_object');
	
	// Copy content
	fade.after(`
		<div class="wt-filter-interface">
			<part class="container-top">
				<div class="h3 title centered">
					Filter Settings
				</div>
			</part>
			<part class="container-mid">
				<table class="wt-filter-interface_table">
					<tbody>
						<tr>
							<td class="wt-border">
								<div class="wt-title">
									My Filters
								</div>
								<div class="wt-existing-filters_container">
								</div>
							</td>
							<td class="wt-new-box">
								<div class="wt-title centered">
									Create New Filter
								</div>
								<div class="wrap" style="padding-bottom:5px;">
									<div class="wt-filter-interface_table-label">
										New Filter Name
									</div>
									<div class="left">
										<input type="text" placeholder="Name" class="wt-filter-name" required />
									</div>
								</div>
								<div class="wrap">
									<div class="wt-filter-interface_table-label">
										Filter By
									</div>
									<div class="left">
										<select class="wt-filter-facade">
										</select>
									</div>
								</div>
								<div class="wt-filter-facade_container">
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</part>
			<part class="container">
				<table class="wt-filter-interface_table">
					<tbody>
						<tr>
							<td>
								<div class="wrap">
									<button class="button right wt-existing-filter-apply" data-button-state="off">
										APPLY
									</button>
								</div>
							</td>
							<td>
								<div class="wrap">
									<button class="button right wt-new-filter-apply" data-button-state="off">
										APPLY
									</button>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</part>
		</div>
	`);
	
	// Vertically align center
	$('.wt-filter-interface').css({
		top: (($(window).height() / 2)) - ($('.wt-filter-interface').height() / 2)
	});
	
	// Binds
	const $f = $('.wt-filter-interface');
	
	// Append existing filters
	var filters = getFilters();
	
	if($.isEmptyObject(filters)){
		$f.find('.wt-existing-filters_container').html(`
			<div>
				You don't have any custom filters
			</div>
		`);
		$f.find('.wt-existing-filter-apply').hide();
	}
	
	for(let i in filters){
		const value = filters[i];
		
		$f.find('.wt-existing-filters_container').append(`
			<div style="wt-existing-filter">
				<input data-filter="${i}" title="${value.status}" class="wt-existing-filter_input" type="text" placeholder="${i}" value="${i}" required />
				<span class="wt-existing-filter_remove">remove</span>
			</div>
		`);
	}
	
	// Remove existing filter
	dark_container.on('click', '.wt-existing-filter_remove', function(){
		var id = $(this).prev().attr('data-filter');
		
		removeFilter(id);
		
		// Update current filter if it's active, remove from options
		if($filter.val() == id) filter('All');
		$filter.find(`option[value="${id}"]`).remove();
		
		render();
		$(this).parent().remove();
		
	});
	
	// Append all statuses to filter-facade
	$filter.find('option').each(function(){
		let id = $(this).attr('value');
		
		if(!filters[id] && id != 'All'){
			$f.find('.wt-filter-facade').append(`
				<option value="${id}">
					${id}
				</option>
			`);
		}
	});
	
	// Blank the facade value
	$f.find('.wt-filter-facade').val('');
	
	// Append to wt-multi-select_container (and hide from filter-facade)
	$f.find('.wt-filter-facade').on('change', function(){
		let id = $(this).val();
		
		$f.find('.wt-filter-facade_container').append(`
			<div class="wt-multi-select">
				<div class="wt-multi-select_object">
					${id}
				</div>
				<span class="wt-multi-select_remove">x</span>
			</div>
		`);
		$(this).find(`option[value="${id}"]`).hide();
		$(this).val('');
	});
	
	// Remove from wt-multi-select_container
	dark_container.on('click', '.wt-multi-select_remove', function(){
		let id = $(this).prev().html().trim();
		
		$f.find(`.wt-filter-facade option[value="${id}"]`).show();
		$(this).closest('.wt-multi-select').remove();
	});
	
	// Fade in
	d.run(function(){
		$('.wt-filter-interface').animate({
			opacity: 1,
		}, 100);
	});
	
	// ----- Apply/cancel
	
	// Listen to existing filter apply
	$f.find('.wt-existing-filter-apply').on('click', function(){
		$('.wt-existing-filter_input').each(function(){
			let id = $(this).attr('data-filter'),
				new_name = $(this).val().trim(),
				filters = getFilters();
			
			// Push new key, remove old key
			if(filters[id]){
				removeFilter(id);
				pushFilter(new_name, {
					status: filters[id].status,
				});
			}
			
			// Update current filter if it's active, remove from options
			if($filter.val() == id) filter('All');
			$filter.find(`option[value="${id}"]`).remove();
			
			render();
			Box.Application.broadcast('notification', 'Saved');
			
		});
	});
	
	// Listen to new filter apply
	$f.find('.wt-new-filter-apply').on('click', function(){
		let new_filter = [],
			name = $('.wt-filter-interface .wt-filter-name').val().trim();
		
		$('.wt-filter-interface .wt-multi-select_object').each(function(){
			let id = $(this).html().trim();
			
			new_filter.push(id);
		});
		
		getFilters();
		pushFilter(name, {
			status: new_filter,
		});
		
		$('.wt-filter-interface').fadeOut(100, function(){
			d.remove(function(){
				render();
				filter(name);
				render();
				$('.wt-filter-interface').off().unbind().remove();
			});
		});
	});
	
	// Cancel on click out of focus
	fade.on('click', function(){
		$('.wt-filter-interface').fadeOut(100, function(){
			d.remove(function(){
				$('.wt-filter-interface').off().unbind().remove();
			});
		});
	});
	
}
	
	// API
	function configure(data){
		
		if(!data) return console.warn('No configuration supplied');
		
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
		bind();
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