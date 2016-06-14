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