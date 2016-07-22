function remove(item, $anchor, dark, bool){
	dark.remove(function(){
		
		// Undo CSS changes to our anchor
		for(let i in item.adjustments){
			const value = item.adjustments[i];
			$anchor.css(i, value);
		}
		
		// Bool
		if(bool == undefined) bool = true;
		if(bool){
			$.post(environment.root+'/delete/tour', {
				id: item.id,
			}).done(function(){
				if(item.commands.href){
					$('body').css('pointer-events', 'none');
					Paperwork.goto(item.commands.href);
				}else{
					// Chain next item or end
					if(chain === 0){
						if(item.commands.chain != undefined) if(!item.commands.chain) return;
						chain++;
						if(items[chain]) render(items[chain]);
					}
				}
			});
		}
	});
}