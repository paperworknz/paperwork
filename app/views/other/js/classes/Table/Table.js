var Table = (function($, environment){
	
	var map,
		filters,
		config;
	
	var $table, $row, $column, $filter, $settings;
	
	if($('.wt-table').length < 1) return;
	
	$('.wt-table').each(function(){
		if(!$(this).data('id')){
			$(this).attr('data-id', Paperwork.random(6));
			$table = $(this);
		}
	});
	
	$row = $table.find('.wt-row'),
	$column = $table.find('.wt-column'),
	$filter = $table.find('.wt-filter'),
	$settings = $table.find('.wt-settings');
	
	config = {
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
	//-> parts/bind.js
	
	// Methods
	//-> parts/hover.js
	//-> parts/map.js
	//-> parts/state.js
	//-> parts/render.js
	//-> parts/filter.js
	//-> parts/filterInterface.js
	
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