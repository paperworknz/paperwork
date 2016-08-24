Core.addService('parse', function(){
	
	function toNumber(i, {decimal = 0, natural = false} = {}){
		
		// Cast all to string
		i = i.toString();
		
		// Replace all characters apart from a number and one dot
		i = i.replace(/[^\d.-]/g, '');
		
		if(i === '') return i;
		if(isNaN(Number(i))) return i;
		
		i = Number(i);
		
		if(decimal) i = Number(i.toFixed(decimal));
		if(natural) {
			i = i.toFixed(decimal);
			i = i.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		}
		
		return i;
	}
	
	function toDollar(i){
		
		i = toNumber(i, {
			decimal: 2,
			natural: true,
		});
		
		if(i) i = '$' + i;
		
		return i;
	}
	
	return {
		toNumber: toNumber,
		toDollar: toDollar,
	}
});