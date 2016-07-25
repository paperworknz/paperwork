Core.addModule('checkout', function(context){
	
	var $body = context.element;
	
	var request = {
		get: `${environment.root}/get/braintree-token`,
	};
	
	// Bind logout button
	$body.on('click', '[data-type="cancel"]', function(){
		Paperwork.goto(`${environment.root}/app`);
	});
	
	// Braintree
	$.get(request.get)
	.done(function(response){
		if(!response) return alert('We\'re sorry - there is a problem with our payments right now.');
		
		$body.find('#braintree-loading').fadeOut();
		braintree.setup(response, 'dropin', {
			container: 'braintree'
		});
	});
	
});