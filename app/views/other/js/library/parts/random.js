function random(length, type){
	let characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
		result = '';
	
	if(type == undefined) type = 'string';
	
	switch(type){
		case 'lower':
			characters = 'abcdefghijklmnopqrstuvwxyz';
			break;
		case 'upper':
			characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
			break
		case 'number':
			characters = '0123456789';
			break;
	}
	
	// Generate random string by length
	for(let i = length; i > 0; --i) result += characters[Math.floor(Math.random() * characters.length)];
	
	return result;
	
}