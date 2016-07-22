Core.addModule('client', function(context){
	
	var $body = context.element;
	
	var client_id = $body.data('id');
	
	var request = {
		putNotes: `${environment.root}/put/client-details`,
		putClient: `${environment.root}/put/client-details`,
	};
	
	bind();
	context.use('tab');
	
	function bind(){
		
		// Delete client button
		$body.on('click', 'button.delete', function(){
			var $this = $(this),
				text = $(this).html();
			
			swal({
				title: 'Are you sure you want to delete this client?',
				text: 'Deleting this client will delete ALL jobs, quotes and invoices!',
				showCancelButton: true,
				closeOnConfirm: true,
			}, function(result){
				if(result){
					$('form[name="delete"]').submit();
				}else{
					Paperwork.ready($this, text);
				}
			});
		});
		
		// Client details
		$body.on('change', '.client-details input, .client-name', function(){
			
			if($body.find('.client-name').val() == '') return;
			
			$.post(request.putClient, {
				id: client_id,
				name: $body.find('[client-name]').val(),
				address: $body.find('[client-address]').val(),
				email: $body.find('[client-email]').val(),
				phone: $body.find('[client-phone]').val(),
			}).done(function(response){
				Paperwork.send('notification', 'Saved');
			});
		});
		
		// Notes
		$body.on('change', '#notes', function(){
			var note = $(this).val() || '';
			
			$.post(request.putNotes, {
				id: client_id,
				notes: note,
			}).done(function(){
				Paperwork.send('notification', 'Saved');
			});
		});
		
	}
	
});