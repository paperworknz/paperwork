Core.addModule('document-copy', function(context){
	
	var $body = context.element;
	var parse = context.require('parse');
	
	var api = {
		get: `${environment.root}/get/job`,
	};
	
	bind();
	
	// Setup job_number, job_id input fields
	$body.find('[data-type="job_number"]').val(context.data.job_number).attr('placeholder', context.data.job_number).blur();
	Paperwork.validate($body.find('.copy-parent'), $body.find('[data-type="new-document"]'), 'document-copy');
	
	function bind(){
		
		// Invalidate interface on input change (need to validate job_id first)
		$body.on('keyup', '[data-type="job_number"]', clearJobID);
		$body.on('keydown', '[data-type="job_number"]', clearJobID);
		
		// Check if job_id is a real job
		$body.on('blur', '[data-type="job_number"]', function(){
			var job_number = $(this).val().trim();
			
			clearJobID();
			if(!job_number){
				$(this).removeClass('ok')
				return;
			}
			
			$.get(`${api.get}/${job_number}`).done(function(response){
				response = JSON.parse(response);
				
				if(response.type == 'error'){
					$body.find('[data-type="job_number"]').val('').removeClass('ok').addClass('error').blur();
					
					setTimeout(function(){
						$body.find('[data-type="job_number"]').removeClass('error');
					}, 500)
				}
				
				if(response.type == 'success'){
					$body.find('[data-type="job_number"]').addClass('ok');
					$body.find('[data-type="job_id"]').val(response.job_id).blur();
				}
			});
		});
		
		// Send new-document event then close interface
		$body.on('click', '[data-type="new-document"]', function(){
			var job_number = parse.toNumber($body.find('[data-type="job_number"]').val()),
				job_id = parse.toNumber($body.find('[data-type="job_id"]').val()) || context.data.job_id,
				template_id = $(this).data('template-id');
			
			newDocument({
				job_id: job_id,
				job_number: job_number,
				template_id: template_id,
			});
		});
		
		// Close interface on cancel button
		$body.on('click', '[data-type="cancel-button"]', close);
	}
	
	function clearJobID(){
		$body.find('[data-type="job_id"]').val('');
	}
	
	function close(){
		context.stop();
	}
	
	function newDocument(request){
		
		// Drop the document's date (let the backend use today's date)
		delete context.data.document_data.date;
		
		Paperwork.send('new-document', {
			job_id: request.job_id,
			job_number: request.job_number,
			template_id: request.template_id,
			document: context.data.document_data,
		});
		
		close();
	}
});