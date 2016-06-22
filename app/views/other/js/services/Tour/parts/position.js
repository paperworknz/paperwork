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
					top: (top - $anchor.outerHeight() + margin),
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
				console.warn('Notification skipped: Screen size too small.');
				remove(item, $anchor, dark, false);
			}
		}
	};
	
	place(state);
	
	return $item;
}