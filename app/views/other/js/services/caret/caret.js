Core.addService('caret', function(){
	
	function end(selector){
		
		let selection = document.getSelection();
		let range = document.createRange();
		let intent = document.querySelector(selector);
		
		if(!intent) return false;
		
		if(intent.lastChild.nodeType == 3){
			range.setStart(intent.lastChild, intent.lastChild.length);
		}else{
			range.setStart(intent, intent.childNodes.length);
		}
		
		selection.removeAllRanges();
		selection.addRange(range);
		
		return true;
	}
	
	return {
		end: end,
	}
});