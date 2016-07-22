function dollar(i, options){
	
	if(!options) options = {};
	
	i = i.replace('$', '');
	i = i.replace(',', '');
	
	if(!Number(i)) i = 0;
	
	i = Number(i);
	i = i.toFixed(2);
	i = i.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	
	
	if(options.sign == undefined || options.sign) i = '$' + i;
	
	return i;
}