Core.addModule('email', function(context){
	
	var $body = context.element;
	
	var api = {
		email: `${environment.root}/post/email`,
	};
	
	render({
		address: context.data.address,
		subject: context.data.subject,
		password: localStorage.ep,
	});
	
	bind();
	
	function bind(){
		
		// Form validation
		Paperwork.validate($body, $body.find('[data-type="send-button"]'), 'email', {
			allowDuplicates: true,
		});
		
		// Send button
		$body.on('click', '[data-type="send-button"]', function(){
			var address = $body.find('[data-type="address"]').val().trim(),
				subject = $body.find('[data-type="subject"]').val().trim(),
				password = $body.find('[data-type="password"]').val(),
				body = $body.find('[data-type="body"]').html();
			
			send({
				address: address,
				subject: subject,
				password: password,
				body: body,
			});
		});
		
		// Cancel button
		$body.on('click', '[data-type="cancel-button"]', close);
	}
	
	function render({address = '', subject = '', password = ''}){
		
		$body.find('[data-type="address"]').val(address);
		$body.find('[data-type="subject"]').val(subject);
		$body.find('[data-type="password"]').val(password);
	}
	
	function send(request){
		
		if(!request.subject) return warning({
			type: 'subject',
			title: 'No Subject',
			text: 'Are you sure you want to send this without a subject?',
			message: request,
			last: true,
		});
		
		// Stop user input
		$body.find('.parent').addClass('noclick noselect').css('opacity', 0.5);
		
		// Wait button
		Paperwork.wait($body.find('[data-type="send-button"]'));
		
		//-> get PDF
		
		$.post(api.email, {
			address: request.address,
			subject: request.subject,
			password: request.password,
			body: request.body,
		}).done(function(response){
			response = JSON.parse(response);
			
			if(response.type == 'error'){
				return error({
					title: 'Mail Not Sent',
					text: `Response: ${response.message}`,
				});
			}
			
			return swal({
				type: 'success',
				title: response.message,
			}, function(response){
				
				return close();
			});
		});
	}
	
	function warning({type, title = 'Warning', text = '', message, last = false}){
		
		return swal({
			type: 'warning',
			title: title,
			text: text,
			showCancelButton: true,
			closeOnConfirm: false,
			showLoaderOnConfirm: last,
		}, function(){
			
			message[type] = true;
			return send(message);
		});
	}
	
	function error({title = 'Mail Not Sent', text = 'There was a problem sending your mail.'}){
		
		return swal({
			type: 'error',
			title: title,
			text: text,
			closeOnConfirm: true,
		}, function(){
			
			// Allow user input
			$body.find('.parent').removeClass('noclick noselect').css('opacity', 1);
			
			// Ready send button
			Paperwork.ready($body.find('[data-type="send-button"]'), 'SEND');
		});
	}
	
	function close(){
		
		context.stop();
	}
});