Core.addModule('flash', function(context){
	
	var $body = context.element;
	
	Paperwork.on('flash', render);
	
	// Click to remove
	$body.on('click', '.alert', function(){
		$(this).slideUp(100, function(){
			$(this).remove();
		});
	});
	
	function render(request){
		
		if(!request.type){
			console.warn('Flash request did not contain a type');
			return false;
		}
		
		if(!request.message){
			console.warn('Flash request did not contain a message');
			return false;
		}
		
		var id = Paperwork.random(6);
		
		$body.append(`
			<div data-id="${id}" class="alert alert-${request.type}" style="display: none;">
				${request.message}
			</div>
		`);
		
		$body.find(`[data-id="${id}"]`).slideDown(100);
	}
	
});