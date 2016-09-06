Core.addService('titles', function(){
	
	var $body = Paperwork.body;
	
	$body.on('mouseover', '[data-title]', function(){
		render($(this));
	});
	
	$body.on('mouseout', '[data-title]', remove);
	$body.on('click', remove);
	$body.on('mousedown', remove);
	
	function render(request){
		
		var element,
			title = request.data('title');
		
		if(!$body.find('#title').length) $body.append(`<div id="title"><div class="title_text"></div><div class="title_triangle"></div></div>`);
		
		element = $body.find('#title');
		
		// Render title
		element.find('.title_text').html(title);
		
		// Position
		element
			.css({
				top: (request.offset().top - element.outerHeight()),
				left: request.offset().left + (request.outerWidth() / 2) - (element.outerWidth() / 3),
			});
		
		// Display
		element.show();
	}
	
	function remove(){
		
		$body.find('#title').hide();
	}
});