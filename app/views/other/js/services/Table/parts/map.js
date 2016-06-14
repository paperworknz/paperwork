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