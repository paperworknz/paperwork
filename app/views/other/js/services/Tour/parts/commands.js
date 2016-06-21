function parseCommands(commands){
	
	var data = {};
	commands = JSON.parse(commands);
	
	for(let i in commands){
		const value = commands[i];
		
		// Post event
		if(i.indexOf('e.') !== -1) Events.post(i.replace('e.', ''), value);
		
		// Parse other
		switch(i){
			case 'href':
				if((value.trim())) data['href'] = value;
				break;
			
			case 'chain':
				if(value !== true || value !== 'true' || value != '1') data['chain'] = false;
				break;
			
			case 'return':
				if(value.toLowerCase() == 'anchor') data['return'] = 'anchor';
				if(value.toLowerCase() == 'item') data['return'] = 'item';
				break;
		}
	}
	
	return data;
	
}