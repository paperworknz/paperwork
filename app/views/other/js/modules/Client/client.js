Core.addModule('client', function(context){
	
	var $body = context.element;
	
	var client_id = $body.data('id');
	
	var api = {
		get: `${environment.root}/jobs`,
		put: `${environment.root}/put/client-details`,
	};
	
	var timer;
	var notes;
	var parse = context.require('parse');
	
	context.use('tab');
	clientDetails();
	newJob();
	clientDelete();
	bindNotes();
	email();
	
	function clientDetails(){
		
		$body.on('change', '.client-details input, [data-type="name"], [data-type="address"]', saveClientDetails);
		$body.on('blur', '[data-type="address"]', saveClientDetails);
	}
	
	function newJob(){
		
		$body.on('click', '[data-type="new-job"]', function(){
			
			Paperwork.goto(`${environment.root}/jobs?id=${client_number}`);
		});
	}
	
	function saveClientDetails(){ 
		if(!$body.find('[data-type="name"]').val().trim()) return;
		
		var address = parse.toText($body.find('[data-type="address"]'));
		
		$.post(api.put, {
			id: client_id,
			name: $body.find('[data-type="name"]').val().trim(),
			address: address.html().trim(),
			email: $body.find('[data-type="email"]').val().trim(),
			phone: $body.find('[data-type="phone"]').val().trim(),
		}).done(function(response){
			
			Paperwork.send('notification');
		});
	}
	
	function clientDelete(){
		
		$body.on('click', 'button.delete', function(){
			var $this = $(this),
				text = $(this).html();
			
			swal({
				title: 'Are you sure you want to delete this client?',
				text: 'Deleting this client will delete ALL jobs, quotes and invoices!',
				showCancelButton: true,
				closeOnConfirm: true,
			}, function(response){
				if(!response) return Paperwork.ready($this, text);
				
				$body.find('form[name="delete"]').submit();
			});
		});
	}
	
	function bindNotes(){
		
		$body.on('keyup', '[data-type="notes"]', function(){
			var value;
			
			value = parse.toText($(this));
			console.log(value.html().trim());
			saveNotes(value.html().trim());
		});
	}
	
	function saveNotes(request){
		
		// Stop timer
		clearTimeout(timer);
		
		// Start timer, save() after 0.5 seconds
		timer = setTimeout(function(){
			
			$.post(api.put, {
				id: client_id,
				notes: request,
			}).done(function(response){
				
				Paperwork.send('notification', 'Saved');
			});
		}, 500);
	}
	
	function email(){
		
		$body.on('click', '[data-type="email-button"]', function(){
			
			var email = $body.find('[data-type="email"]').val();
			
			context.load('email', {
				address: email,
			});
		});
	}
});