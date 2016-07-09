var Tour = (function($, environment, Events){
	
	var chain,
		items = [];
	
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
				if(value !== true && value !== 'true' && value != '1') data['chain'] = false;
				break;
			
			case 'return':
				if(value.toLowerCase() == 'anchor') data['return'] = 'anchor';
				if(value.toLowerCase() == 'item') data['return'] = 'item';
				break;
		}
	}
	
	return data;
	
}
function position(item, $anchor, dark){
	
	var count = 0,
		$dark_container = dark.object,
		$fade = dark.object.find('.dark_object'),
		$item,
		$triangle,
		$text,
		top,
		left,
		width,
		height,
		margin,
		state;
	
	// Get major position eg. top-left = top
	if(item.position) state = item.position.split('-')[0];
	
	// Recursive positioning function
	var place = function recur(state){
		
		$dark_container.find('.pw-item-container').remove();
		$fade.after(`
			<div class="pw-item-container wrap">
			</div>
		`);
		
		// Append item and triangle to container
		switch(state){
			case 'left':
			case 'right':
				$dark_container.find('.pw-item-container').append(`
					<div class="pw-item-text ${state}">
						${item.text}
					</div>
					<div class="triangle-parent ${state}">
						<div class="triangle ${state}">
						</div>
					</div>
				`);
				break;
			
			case 'top':
				$dark_container.find('.pw-item-container').append(`
					<div class="pw-item-text">
						${item.text}
					</div>
					<div class="triangle-parent ${state}">
						<div class="triangle ${state}">
						</div>
					</div>
				`);
				break;
			
			case 'bottom':
				$dark_container.find('.pw-item-container').append(`
					<div class="triangle-parent ${state}">
						<div class="triangle ${state}">
						</div>
					</div>
					<div class="pw-item-text">
						${item.text}
					</div>
				`);
				break;
		}
		
		// Cache item DOM parts
		$item = $dark_container.find('.pw-item-container');
		$triangle = $dark_container.find('.triangle');
		$text = $dark_container.find('.pw-item-text');
		margin = 5; // Distance from anchor
		
		// Triangle positioning
		switch(state){
			case 'left':
			case 'right':
				$triangle.parent().css('height', $text.outerHeight());
				$triangle.css('top', (($triangle.parent().outerHeight() / 2) - ($triangle.outerHeight() / 2)));
				break;
			
			case 'top':
			case 'bottom':
				$triangle.parent().css('width', $text.outerWidth());
				break;
		}
		
		// Cache width and height after item is initialised
		top = $anchor.offset().top;
		left = $anchor.offset().left;
		width = $item.outerWidth();
		height = $item.outerHeight();
		
		// Position on page
		switch(state){
			case 'top':
				$item.css({
					top: (top - height - margin),
					left: left + (($anchor.outerWidth() / 2) - (width / 2)),
				});
				
				display($item.offset().top, $item.offset().left, width, height, count);
				break;
			
			case 'right':
				$item.css({
					top: (top + ($anchor.outerHeight() / 2) - (height / 2)),
					left: (left + $anchor.outerWidth() + 5),
				});
				
				display($item.offset().top, $item.offset().left, width, height, count);
				break;
			
			case 'bottom':
				$item.css({
					top: (top + $anchor.outerHeight() + margin),
					left: left + (($anchor.outerWidth() / 2) - (width / 2)),
				});
				
				display($item.offset().top, $item.offset().left, width, height, count);
				break;
			
			case 'left':
				$item.css({
					top: (top + ($anchor.outerHeight() / 2) - (height / 2)),
					left: (left - width - 5),
				});
				
				display($item.offset().top, $item.offset().left, width, height, count);
				break;
		}
		
		function display(top, left, width, height, i){
			let screenWidth = $(window).width(),
				screenHeight = $(window).height();
			
			if(i !== 4){
				if(top < 0){
					count++;
					return recur('right');
				}else if((left + width) > screenWidth){
					count++;
					return recur('bottom');
				}else if((top + height) > screenHeight){
					count++;
					return recur('left');
				}else if(left < 0){
					count++;
					return recur('top');
				}
			}else{
				console.warn('Tour skipped: Screen size too small.');
				remove(item, $anchor, dark, false);
			}
		}
	};
	
	place(state);
	
	return $item;
}
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
		console.warn('Tour skipped: Anchor unavailable.');
		remove(item, $anchor, dark, false);
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
	
	function run(){
		$.post(environment.root+'/get/tour', {
			page: environment.page,
		}).done(function(data){
			if(data){
				items = JSON.parse(data);
				if(items.length > 1) chain = 0;
				render(items[0]);
			}
		});
	}
	
	return {
		run: run,
		render: render,
	};
	
})(jQuery, environment, Events);