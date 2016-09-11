Core.addModule('job', function(context){
	
	var $body = context.element;
	
	var api = {
		post: `${environment.root}/post/document`,
		delete: `${environment.root}/delete/document`,
		put: `${environment.root}/put/job`,
		getPDFList: `${environment.root}/get/pdf-json/${job.job_number}`,
	};
	
	var pdf = context.require('pdf');
	var parse = context.require('parse');
	
	var doc = context.use('document');
	var tab = context.use('tab');
	
	getPDFList();
	bindProperties();
	bindNotes();
	changeStatus();
	jobName();
	jobDelete();
	bindDocumentInterfaces();
	saveDocument();
	documentDelete();
	bindNewDocument();
	
	listen();
	
	function listen(){
		
		// Create a new document
		// - accepts an object with job_id, client_id, template_id
		// - accepts document (optional - used for copy interface)
		Paperwork.on('document.new', function(request){
			
			if(typeof request !== 'object' || request === null){
				return console.warn('New document request not an object');
			}
			
			newDocument(request);
		});
	}
	
	function saveDocument(){
		
		$body.on('click', '[data-type="save-button"]', function(){
			var document_id = $body.find('.tabopen [data-type="document"]').data('id');
			
			Paperwork.send('document.job.save', document_id);
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
					<div style="height: 24px; line-height: 24px;">
						<a target="_blank" href="${environment.root}/get/pdf/${job.job_number}/${value}" onclick="event.stopPropagation();">${value}</a>
					</div>
				`);
			}
		});
	}
	
	function bindProperties(){
		
		// Load client module
		$body.on('click', '[data-type="client"]', function(){
			
			context.load('client', job.client_number);
		});
		
		// Load email module
		$body.on('click', '[data-type="email"]', function(){
			
			context.load('email', {
				address: job.client_email,
			});
		});
	}
	
	function bindNotes(){
		
		// Focus notes
		$body.on('click', '.note-wrap', function(){
			$body.find('.notepad').focus();
		});
		
		// Notes change
		$body.on('blur', '.notepad', function(){
			
			var notes;
			
			notes = parse.toText($(this));
			
			$.post(api.put, {
				notes: notes.html().trim(),
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
				
				$body.find('[data-type="delete-job"]').submit();
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
				document_id: document_id,
				documents: document_data,
			});
		});
		
		$body.on('click', '[data-type="margin-button"]', function(){
			var document_id = $body.find('.tabopen [data-type="document"]').data('id'),
				document_data = doc.documents(document_id);
			
			context.load('document-margin', {
				document_id: document_id,
				documents: document_data,
			});
		});
		
		$body.on('click', '[data-type="pdf-button"]', function(){
			var doc = getPDFHTML(),
				job_number = job.job_number;
			
			pdf.post({
				directory: job_number,
				document_html: doc.document_html,
				document_name: doc.document_name,
			}, function(response){
				
				if(!response) return swal({
					title: 'Sorry, something went wrong',
					text: 'Please try again!',
					type: 'error',
					closeOnConfirm: false,
				}, function(){
					
					Paperwork.goto('reload');
				});
				
				Paperwork.ready($body.find('[data-type="pdf-button"]'), 'PDF');
				Paperwork.goto(`${response.location}?view=attachment`, false);
			});
		});
		
		$body.on('click', '[data-type="email-button"]', function(){
			var document_id = $body.find('.tabopen [data-type="document"]').data('id'),
				job_id = job.job_id,
				job_number = job.job_number,
				doc = getPDFHTML();
			
			Paperwork.wait($body.find('.tabopen [data-type="pdf-button"]'));
			
			pdf.post({
				directory: job_number,
				document_html: doc.document_html,
				document_name: doc.document_name,
			}, function(response){
				
				Paperwork.ready($body.find('.tabopen [data-type="pdf-button"]'), 'PDF');
				
				if(!response) return swal({
					title: 'Sorry, something went wrong',
					text: "We couldn't generate a PDF. Please try again!",
					type: 'error',
					closeOnConfirm: false,
				}, function(){
					
					Paperwork.goto('reload');
				});
				
				context.load('email', {
					address: job.client_email,
					attachments: {
						[doc.document_name]: response.location,
					},
				});
			});
		});
	}
	
	function getPDFHTML(){
		
		var document_html = $body.find('.tabopen [data-type="document"]').html().trim(),
			template_name = $body.find('.tabopen [data-type="document"] [data-template]').data('template').trim(),
			tab_id = $body.find('[data-type="tab"].active').data('id'), // Used in template_name
			tab_name = $body.find('[data-type="tab"].active').html().trim().toLowerCase(), // Used in template_name
			document_name = `${job.job_number}_${tab_id}-${tab_name}.pdf`;
		
		// HTML
		document_html = `
		<!DOCTYPE html>
		<html lang='en'>
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
				<meta name="format-detection" content="telephone=no">
				<link rel="stylesheet" type="text/css" href="${environment.root}/css/library/Document.css">
				<link rel="stylesheet" type="text/css" href="${environment.root}/css/templates/${template_name}.css">
				<style>
					doc-body {
						letter-spacing: -1px;
					}
					[data-type="inventory-input"] {
						display: none!important;
					}
				</style>
			</head>
			<body>
				${document_html}
			</body>
		</html>
		`;
		
		return {
			document_html: document_html,
			document_name: document_name,
		}
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
		Paperwork.send('document.build', request.document);
	}
});