Core.addModule('app', function(context){
	
	var $body = context.element;
	
	$body.on('click', '[data-type="logout"]', function(){
		Paperwork.goto(`${environment.root}/get/logout`, false);
	});
});