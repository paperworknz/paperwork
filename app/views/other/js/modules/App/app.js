Core.addModule('app', function(context){
	
	var $body = context.element;
	
	function start(){
		$body.on('click', '[data-type="logout"]', function(){
			Paperwork.goto(`${environment.root}/get/logout`);
		});
	}
	
	return {
		start: start,
	}
	
});