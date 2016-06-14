function filter(filter){
	
	if(!$filter.find(`[value="${filter}"]`).length){
		console.warn('Filter unavailable');
		return;
	}
	
	map.filter = filter;
	setMap();
}