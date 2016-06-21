var Tour = (function($, environment, Events){
	
	var chain,
		items = [];
	
function render(item){
	var $anchor = $(item.anchor),
		dark = Paperwork.dark(),
		dark_container = dark.object,
		fade = dark.object.find('.dark_object'),
		adjustments = {},
		commands = {};
	
	// Commands
	if(item.commands) commands = parseCommands(item.commands);
	
	if(!$anchor.length){
		console.warn('Item failed: No anchor');
		remove();
		return;
	}
	
	// Anchor CSS adjustments
	if($anchor.css('box-shadow')) adjustments['box-shadow'] = $anchor.css('box-shadow');
	if($anchor.css('z-index')) adjustments['z-index'] = $anchor.css('z-index');
	
	// Position relative (or existing position if not static)
	if($anchor.css('position') == 'static'){
		adjustments['position'] = 'static';
		$anchor.css('position', 'relative'); // Position relative
	}
	
	// Background-color white if none set
	if($anchor.css('background-color') == 'auto' || $anchor.css('background-color') == 'rgba(0, 0, 0, 0)'){
		adjustments['background-color'] = '';
		$anchor.css('background-color', 'white');
	}
	
	$anchor.css('z-index', '1000'); // New z-index
	$anchor.css('box-shadow', '0 1px 2px rgba(0,0,0,.1)'); // Box shadow
	
	// Append item after fade
	fade.after(`
		<div class="pw-item-container">
			<div class="triangle-parent">
				<div class="triangle-left">
				</div>
			</div>
			<div class="pw-item-text">
				${item.text}
			</div>
		</div>
	`);
	
	// Cache item DOM parts
	var $item = dark_container.find('.pw-item-container'),
		$triangle_parent = dark_container.find('.triangle-parent'),
		$triangle = dark_container.find('.triangle-left'),
		$text = dark_container.find('.pw-item-text');
	
	// Binds
	if(commands.return){
		if(commands.return == 'anchor'){
			$anchor.on('click', remove);
			$item.find('.pw-item-text').css('cursor', 'default');
		}else if(commands.return == 'item'){
			$item.on('click', remove);
			$anchor.css('pointer-events', 'none');
		}else{
			$anchor.on('click', remove);
			$item.on('click', remove);
		}
	}else{
		$anchor.on('click', remove);
		$item.on('click', remove);
	}
	
	// Item CSS
	$triangle_parent.css('height', $text.outerHeight());
	$triangle.css('top', (($triangle_parent.outerHeight() / 2) - ($triangle.outerHeight() / 2)));
	$item.css({
		height: ($text.outerHeight() + 1),
		width: ($triangle_parent.outerWidth() + $text.outerWidth() + 1),
	});
	$item.css({
		top: (($anchor.offset().top) + ($anchor.outerHeight() / 2) - ($item.outerHeight() / 2)),
		left: (($anchor.offset().left) + ($anchor.outerWidth()) + 5),
	});
	
	// Check for off-screen
	var rightEdge = $item.outerWidth() + $item.offset().left,
		screenEdge = $(window).outerWidth();
	
	if(rightEdge > screenEdge) $text.css('width', ($item.outerWidth() - (rightEdge - screenEdge) - 21)); // 6 for triangle + 15
	
	// Run dark container
	dark.run();
	
	function remove(){
		dark.remove(function(){
			
			// Undo CSS changes to our anchor
			for(let i in adjustments){
				const value = adjustments[i];
				$anchor.css(i, value);
			}
			
			$.post(environment.root+'/delete/tour', {
				id: item.id,
			}).done(function(){
				if(commands.href){
					$('body').css('pointer-events', 'none');
					Paperwork.goto(commands.href);
				}else{
					// Chain next item or end
					if(chain === 0 && commands.chain){
						chain++;
						if(items[chain]) render(items[chain]);
					}
				}
			});
		});
	}
}
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
	
	function run(){
		$.post(environment.root+'/get/tour', {
			page: environment.page,
		}).done(function(data){
			if(data){
				data = JSON.parse(data);
				if(data.length > 1) chain = 0;
				render(data[0]);
			}
		});
	}
	
	return {
		run: run,
		render: render,
	};
	
})(jQuery, environment, Events);