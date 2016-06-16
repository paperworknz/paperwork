function render(notification){
	var $anchor = $(notification.anchor),
		dark = Paperwork.dark(),
		dark_container = dark.object,
		fade = dark.object.find('.dark_object'),
		adjustments = {};
	
	if(!$anchor.length){
		console.warn('Notification failed: No anchor');
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
		adjustments['background-color'] = 'auto';
		$anchor.css('background-color', 'white');
	}
	
	$anchor.css('z-index', '51'); // New z-index
	$anchor.css('box-shadow', '0 1px 2px rgba(0,0,0,.1)'); // Box shadow
	
	// Append notification after fade
	fade.after(`
		<div class="pw-notification-container">
			<div class="triangle-parent">
				<div class="triangle-left">
				</div>
			</div>
			<div class="pw-notification-text">
				${notification.text}
			</div>
		</div>
	`);
	
	// Cache notification DOM parts
	var $item = dark_container.find('.pw-notification-container'),
		$triangle_parent = dark_container.find('.triangle-parent'),
		$triangle = dark_container.find('.triangle-left'),
		$text = dark_container.find('.pw-notification-text');
	
	// Binds
	$anchor.on('click', remove);
	$item.on('click', remove);
	
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
	
	if(rightEdge > screenEdge){
		$text.css('width', ($item.outerWidth() - (rightEdge - screenEdge) - 21)); // 6 for triangle + 15
	}
	
	// Run dark container
	dark.run();
	
	function remove(event){
		dark.remove(function(){
			
			// Undo CSS changes to our anchor
			for(let i in adjustments){
				const value = adjustments[i];
				$anchor.css(i, value);
			}
			
			// Chain next notification or end
			if(chain === 0){
				chain++;
				if(notifications[chain]) render(notifications[chain]);
			}
			
			$.post(environment.root+'/delete/notification', {
				id: notification.id,
			});
		});
	}
}