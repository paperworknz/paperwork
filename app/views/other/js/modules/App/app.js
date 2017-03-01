Core.addModule('app', function(context){
	
	var $body = context.element;
	
	email();
	
	$body.on('click', '[data-type="logout"]', function(){
		Paperwork.goto(`${environment.root}/get/logout`, false);
	});
	
	function email(){
		
		$body.on('click', '[data-type="email-button"]', function(){
			
			var email = $(this).data('value');
			
			context.load('email', {
				address: email,
				subject: `Invoice reminder`,
			});
		});
	}
});