function filter(filter){
	
	if(!filter) filter = 'All';
	
	if(!$filter.find(`[value="${filter}"]`).length){
		console.warn(`Filter ${filter} unavailable`);
	}
	
	map.filter = filter;
	setMap();
}

function getFilters(){
	
	if(!localStorage){
		console.warn('Unable to access localStorage');
		return;
	}
	
	// Make empty object if no filters exist
	if(!localStorage.filter) localStorage.filter = JSON.stringify({});
	
	// Return filter object
	return JSON.parse(localStorage.filter);
}

function pushFilter(name, filter){
	
	let filters = getFilters();
	
	if(!typeof name === 'string'){
		console.warn('No filter name given for new filter');
		return;
	}
	
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