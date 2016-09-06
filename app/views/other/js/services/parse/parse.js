Core.addService('parse', function(){
	
	function toText(element){
		
		var clone = element.clone();
		
		// Wrap all shallow text nodes in <div></div>
		clone.contents()
		.filter(function(){ return this.nodeType === 3; })
		.wrap('<div>');
		
		// Remove empty elements
		clone.contents()
		.filter(function(){ return $.trim(this.innerHTML).length === 0 })
		.remove();
		
		clone.find('*').each(function(){
			
			let contents = $(this).contents();
			
			if($(this).is('br')) return true;
			if(!$(this).is('div')) $(this).replaceWith(contents);
		});
		
		// Flatten if only one div
		if(clone.children().length === 1) return clone.children();
		
		// Return element
		return clone;
	}
	
	function toNumber(i, {decimal = 0, natural = false} = {}){
		
		// Cast all to string
		i = i.toString();
		
		// Replace all characters apart from a number and one dot
		i = i.replace(/[^\d.-]/g, '');
		
		if(i === '') return i;
		if(isNaN(Number(i))) return i;
		
		i = Number(i);
		
		if(decimal != undefined) i = Number(i.toFixed(decimal));
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
		toText: toText,
		toNumber: toNumber,
		toDollar: toDollar,
	}
});