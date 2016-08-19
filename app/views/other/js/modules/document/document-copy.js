Core.addModule('document-copy', function(context){
	
	var $body = context.element;
	var parse = context.require('parse');
	
	var api = {
		get: `${environment.root}/get/job`,
	};
	
	$body.find('[data-type="job_number"]').val(context.data.job_number).attr('placeholder', context.data.job_number);
	Paperwork.validate($body.find('.copy-parent'), $body.find('[data-type="new-document"]'), 'document-copy');
	
	$body.on('change', '[data-type="job_number"]', function(){
		var job_number = $(this).val().trim();
		
		// Invalidate job_number
		$(this).removeClass('ok');
		$body.find('[data-type="validate-job_number"]').val('');
		
		if(!job_number) return;
		
		$.get(`${api.get}/${job_number}`).done(function(response){
			response = JSON.parse(response);
			
			if(response.type == 'error'){
				$body.find('[data-type="job_number"]').val('').addClass('error').blur();
				
				setTimeout(function(){
					$body.find('[data-type="job_number"]').removeClass('error');
				}, 500)
			}
			
			if(response.type == 'success'){
				
				// Allow validation
				$body.find('[data-type="job_number"]').addClass('ok');
				$body.find('[data-type="validate-job_number"]').val(response.job_id);
			}
		});
	});
	
	$body.on('click', '[data-type="new-document"]', function(){
		var job_number = parse.toNumber($body.find('[data-type="job_number"]').val()),
			job_id = parse.toNumber($body.find('[data-type="validate-job_number"]').val()) || context.data.job_id,
			template_id = $(this).data('template-id');
		
		Paperwork.send('new-document', {
			job_id: job_id,
			job_number: job_number,
			template_id: template_id,
			document: context.data.document_data,
		});
		
		context.stop();
	});
	
	$body.on('click', '[data-type="cancel-button"]', function(){
		context.stop();
	})
});