Core.addModule('email', function(context){
	
	var $body = context.element;
	
	var api = {
		email: `${environment.root}/post/email`,
	};
	
	render({
		address: context.data.address,
		subject: context.data.subject,
		password: localStorage.ep,
		attachments: context.data.attachments,
	});
	
	bind();
	
	function bind(){
		
		// Form validation
		Paperwork.validate($body, $body.find('[data-type="send-button"]'), 'email', {
			allowDuplicates: true,
		});
		
		// Remove attachment
		$body.on('click', '.attachment-remove', function(){
			var attachment_name = $(this).closest('[data-type="attachment"]').data('name');
			
			delete context.data.attachments[attachment_name];
			$(this).closest('[data-type="attachment"]').hide();
		});
		
		// Send button
		$body.on('click', '[data-type="send-button"]', function(){
			var address = $body.find('[data-type="address"]').val().trim(),
				cc = $body.find('[data-type="cc"]').val().trim(),
				bcc = $body.find('[data-type="bcc"]').val().trim(),
				subject = $body.find('[data-type="subject"]').val().trim(),
				password = $body.find('[data-type="password"]').val(),
				body = $body.find('[data-type="body"]').html(),
				attachments = context.data.attachments;
			
			send({
				address: address,
				cc: cc,
				bcc: bcc,
				subject: subject,
				password: password,
				body: body,
				attachments: attachments,
			});
		});
		
		// Cancel button
		$body.on('click', '[data-type="cancel-button"]', close);
	}
	
	function render({address = '', subject = '', password = '', attachments = {}}){
		
		$body.find('[data-type="address"]').val(address);
		$body.find('[data-type="subject"]').val(subject);
		$body.find('[data-type="password"]').val(password);
		
		// Attachments
		for(let i in attachments){
			
			$body.find('[data-type="attachments"]').append(`
				<part class="attachment wrap" data-type="attachment" data-name="${i}">
					<part>
						${i}.pdf
					</part>
					<part class="attachment-remove remove-btn"></part>
				</part>
			`);
		}
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
		
		$.post(api.email, {
			address: request.address,
			cc: request.cc,
			bcc: request.bcc,
			subject: request.subject,
			password: request.password,
			body: request.body,
			attachments: request.attachments,
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