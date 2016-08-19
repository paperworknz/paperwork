Core.addModule('job', function(context){
	
	var $body = context.element;
	
	var api = {
		post: `${environment.root}/post/document`,
		delete: `${environment.root}/delete/document`,
		put: `${environment.root}/put/job`,
		getPDFList: `${environment.root}/get/pdf-json/${job.job_number}`,
	};
	
	var doc = context.use('document');
	context.use('tab');
	
	getPDFList();
	bindNotes();
	changeStatus();
	jobName();
	jobDelete();
	bindDocumentInterfaces();
	documentDelete();
	bindNewDocument();
	
	listen();
	
	function listen(){
		
		// Create a new document
		// - accepts an object with job_id, client_id, template_id
		// - accepts document (optional - used for copy interface)
		Paperwork.on('new-document', function(request){
			
			if(typeof request !== 'object' || request === null){
				return console.warn('New document request not an object');
			}
			
			newDocument(request);
		});
	}
	
	function getPDFList(){
		
		Paperwork.wait($body.find('.pdf-load'));
		
		$.get(api.getPDFList)
		.done(function(response){
			
			if(response == '0'){
				$body.find('.pdf-load').closest('tr').remove();
				return;
			}
			
			response = JSON.parse(response);
			
			$body.find('.pdf-load').remove();
			$body.find('.pdf-title').html('Paper');
			
			for(let i in response){
				const value = response[i];
				
				$body.find('.pdf-list').append(`
					<div style="height:24px;line-height:24px">
						<a target="_blank" href="${environment.root}/get/pdf/${job.job_number}/${value}">${value}</a>
					</div>
				`);
			}
		});
	}
	
	function bindNotes(){
		
		// Focus notes
		$body.on('click', '.note-wrap', function(){
			$body.find('.notepad').focus();
		});
		
		// Notes change
		$body.on('blur', '.notepad', function(){
			
			$.post(api.put, {
				notes: $(this).html(),
				id: job.job_id,
			}).done(function(response){
				
				Paperwork.send('notification');
			});
		});
	}
	
	function changeStatus(){
		
		$body.on('change', '.status', function(){
			if($(this).val() == undefined) return;
			
			$.post(api.put, {
				id: job.job_id,
				status: $(this).val()
			}).done(function(response){
				if(response == '0') return Paperwork.send('notification', 'Failed to change');
				
				Paperwork.send('notification', 'Saved');
			});
		});
	}
	
	function jobName(){
		
		$body.on('change', '.job-name', function(){
			if($('.job-name').val() == '') return;
			
			$.post(api.put, {
				name: $('.job-name').val().trim(),
				id: job.job_id,
			}).done(function(response){
				Paperwork.send('notification', 'Saved');
			});
		});
	}
	
	function jobDelete(){
		
		$body.on('click', '[data-type="job-delete-button"]', function(){
			
			var button = {
				name: $(this).text().trim(),
				element: $(this),
			};
			
			swal({
				title: 'Are you sure you want to delete this job?',
				text: 'Deleting this job will delete ALL quotes and invoices attached',
				showCancelButton: true,
				closeOnConfirm: true,
			}, function(response){
				if(!response) return Paperwork.ready(button.element, button.name);
				
				$body.find('[job-del-form]').submit();
			});
		});
	}
	
	function bindDocumentInterfaces(){
		
		$body.on('click', '[data-type="copy-button"]', function(){
			var document_id = $body.find('.tabopen [data-type="document"]').data('id'),
				document_data = doc.documents(document_id);
			
			context.load('document-copy', {
				job_id: job.job_id,
				job_number: job.job_number,
				client_id: job.client_id,
				document_id: document_id,
				document_data: document_data,
			});
		});
	}
	
	function documentDelete(){
		
		$body.on('click', '[data-type="document-delete-button"]', function(){
			
			var document_id = $body.find('.tabopen [data-type="document"]').data('id');
			var button = {
				name: $(this).text().trim(),
				element: $(this),
			};
			
			swal({
				title: 'Are you sure you want to delete this document?',
				text: 'You can undo this later',
				showCancelButton: true,
				closeOnConfirm: true,
			}, function(response){
				if(!response) return Paperwork.ready(button.element, button.name);
				
				$.post(api.delete, {
					id: document_id,
				}).done(function(response){
					var tab_id = $body.find('[data-type="tab-container"] .active').data('id');
					
					Paperwork.send(`tab.${context.name}.remove`, tab_id);
				});
			});
		});
	}
	
	function bindNewDocument(){
		
		$body.on('click', '[data-type="new-document"]', function(){
			
			var template_id = $(this).data('template-id'),
				client_id = job.client_id,
				job_id = job.job_id;
			
			var button = {
				name: $(this).text().trim(),
				element: $(this),
			};
			
			newDocument({
				job_id: job_id,
				client_id: client_id,
				template_id: template_id,
			});
		});
	}
	
	function newDocument(request){
		
		$.post(api.post, {
			job_id: request.job_id,
			template_id: request.template_id,
			document: request.document, // Optional (overrides default data)
		}).done(function(response){
			response = JSON.parse(response);
			
			// If request contains a different job_number, redirect to that job
			if(request.job_number && (request.job_number != job.job_number)){
				return Paperwork.goto(`${environment.root}/job/${request.job_number}?activate=last`);
			}
			
			renderNewDocument({
				name: request.name || response.name,
				body: request.body || response.body,
				document: response.document,
			});
		});
	}
	
	function renderNewDocument(request){
		
		var tab_id,
			$tabs = $body.find('[data-type="tab-container"] ul'),
			$obj = $body.find('[data-type="obj-container"]'),
			name,
			body;
		
		tab_id = $tabs.children().last().prev().data('id') + 1;
		
		$tabs.children().last().before(`
			<li data-type="tab" data-id="${tab_id}" class="tab" style="opacity: 0.5;">
				${request.name}
			</li>
		`);
		
		$body.find('[data-type="tab"]').filter(`[data-id="${tab_id}"]`).animate({
			opacity: 1,
		}, 300, 'swing');
		
		$obj.children().last().before(`
			<part data-type="obj" data-id="${tab_id}" class="tabobj">
				${request.body}
			</part>
		`);
		
		Paperwork.send(`tab.${context.name}.activate`, tab_id);
		Paperwork.send(`document.${context.name}.build`, request.document);
	}
});