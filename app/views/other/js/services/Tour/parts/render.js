function render(item){
	var $item,
		$anchor = $(item.anchor),
		dark = Paperwork.dark();
	
	// CSS adjustments
	item.adjustments = {};
	
	// Commands
	if(item.commands) item.commands = parseCommands(item.commands);
	
	// Anchor undefined
	if(!$anchor.length){
		console.warn('Tour failed: No anchor - notification removed.');
		remove(item, $anchor, dark);
		return;
	}
	
	// Anchor CSS item.adjustments
	if($anchor.css('box-shadow')) item.adjustments['box-shadow'] = $anchor.css('box-shadow');
	if($anchor.css('z-index')) item.adjustments['z-index'] = $anchor.css('z-index');
	
	// Position relative (or existing position if not static)
	if($anchor.css('position') == 'static'){
		item.adjustments['position'] = 'static';
		$anchor.css('position', 'relative'); // Position relative
	}
	
	// Background-color white if none set
	if($anchor.css('background-color') == 'auto' || $anchor.css('background-color') == 'rgba(0, 0, 0, 0)'){
		item.adjustments['background-color'] = '';
		$anchor.css('background-color', 'white');
	}
	
	$anchor.css('z-index', '1000'); // New z-index
	$anchor.css('box-shadow', '0 1px 2px rgba(0,0,0,.1)'); // Box shadow
	
	// Positioning
	$item = position(item, $anchor, dark);
	
	// Binds
	if(item.commands.return){
		if(item.commands.return == 'anchor'){
			
			$item.find('.pw-item-text').css('cursor', 'default');
			$anchor.on('click', function(){
				remove(item, $anchor, dark);
			});
		}else if(item.commands.return == 'item'){
			
			$item.on('click', function(){
				remove(item, $anchor, dark);
			});
		}
	}else{
		$anchor.on('click', function(){
			remove(item, $anchor, dark);
		});
		$item.on('click', function(){
			remove(item, $anchor, dark);
		});
	}
	
	// Run dark container
	dark.run();
}