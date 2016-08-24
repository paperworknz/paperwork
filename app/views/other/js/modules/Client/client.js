Core.addModule('client', function(context){
	
	var $body = context.element;
	
	var client_id = $body.data('id');
	
	var request = {
		put: `${environment.root}/put/client-details`,
	};
	
	context.use('tab');
	clientDetails();
	clientDelete();
	bindNotes();
	email();
	
	function clientDetails(){
		
		$body.on('change', '.client-details input, .client-name', function(){
			
			if(!$body.find('.client-name').val().trim()) return;
			
			$.post(request.put, {
				id: client_id,
				name: $body.find('[client-name]').val().trim(),
				address: $body.find('[client-address]').val().trim(),
				email: $body.find('[client-email]').val().trim(),
				phone: $body.find('[client-phone]').val().trim(),
			}).done(function(response){
				
				Paperwork.send('notification');
			});
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
		
		$body.on('change', '#notes', function(){
			var notes = $(this).val().trim();
			
			$.post(request.put, {
				id: client_id,
				notes: notes,
			}).done(function(response){
				
				Paperwork.send('notification', 'Saved');
			});
		});
	}
	
	function email(){
		
		$body.on('click', '[data-type="email-button"]', function(){
			
			var email = $body.find('[client-email]').val();
			
			context.load('email', {
				address: email,
			});
		});
	}
});