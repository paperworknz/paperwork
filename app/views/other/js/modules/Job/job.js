Core.addModule('job', function(context){
	
	var $body = context.element;
	
	var api = {
		post: `${environment.root}/post/document`,
		delete: `${environment.root}/delete/document`,
		put: `${environment.root}/put/job`,
		getPDFList: `${environment.root}/get/pdf-json/${job.job_number}`,
	};
	
	var pdf = context.require('pdf');
	
	var doc = context.use('document');
	var tab = context.use('tab');
	
	getPDFList();
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
					<div style="height:24px;line-height:24px">
						<a target="_blank" href="${environment.root}/get/pdf/${job.job_number}/${value}" onclick="event.stopPropagation();">${value}</a>
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
				Paperwork.goto(response.location, false);
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
		
		var document_html = $body.find('.tabopen [data-type="document"]').html(),
			template_name = $body.find('.tabopen [data-type="document"] [data-template]').data('template'),
			tab_id = $body.find('[data-type="tab"].active').data('id'), // Used in template_name
			tab_name = $body.find('[data-type="tab"].active').html().toLowerCase(), // Used in template_name
			document_name = `${job.job_number}_${tab_id}-${tab_name}`;
		
		// HTML
		document_html = `
		<!DOCTYPE html>
		<html lang='en'>
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
				<meta name="format-detection" content="telephone=no">
				<style>
				/*! normalize.css v4.1.1 | MIT License | github.com/necolas/normalize.css */progress,sub,sup{vertical-align:baseline}button,hr,input{overflow:visible}[type=checkbox],[type=radio],legend{padding:0;box-sizing:border-box}doc-body *,legend{box-sizing:border-box}doc-body,doc-body doc-section{display:-webkit-box;display:-ms-flexbox}article,aside,details,doc-body *,doc-body [data-type=inventory-input],doc-body [data-type=inventory-content],figcaption,figure,footer,header,main,menu,nav,section,summary{display:block}html{font-family:sans-serif;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}body{margin:0}audio,canvas,progress,video{display:inline-block}audio:not([controls]){display:none;height:0}[hidden],template{display:none}a{background-color:transparent;-webkit-text-decoration-skip:objects}a:active,a:hover{outline-width:0}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted}b,strong{font-weight:bolder}dfn{font-style:italic}h1{font-size:2em;margin:.67em 0}mark{background-color:#ff0;color:#000}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}img{border-style:none}svg:not(:root){overflow:hidden}code,kbd,pre,samp{font-family:monospace,monospace;font-size:1em}figure{margin:1em 40px}hr{box-sizing:content-box;height:0}button,input,select,textarea{font:inherit;margin:0}optgroup{font-weight:700}button,select{text-transform:none}[type=reset],[type=submit],button,html [type=button]{-webkit-appearance:button}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button::-moz-focus-inner{border-style:none;padding:0}[type=button]:-moz-focusring,[type=reset]:-moz-focusring,[type=submit]:-moz-focusring,button:-moz-focusring{outline:ButtonText dotted 1px}fieldset{border:1px solid silver;margin:0 2px;padding:.35em .625em .75em}legend{color:inherit;display:table;max-width:100%;white-space:normal}textarea{overflow:auto}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}[type=search]::-webkit-search-cancel-button,[type=search]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-input-placeholder{color:inherit;opacity:.54}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}doc-body{width:210mm;max-width:210mm;min-width:210mm;color:#333;background-color:#fff;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;line-height:1.42857143;font-size:13px!important;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column}doc-body doc-section{display:flex;cursor:default}doc-body doc-section>*{-webkit-box-flex:1;-ms-flex:1;flex:1}doc-body .inventory-item_price,doc-body .inventory-item_qty,doc-body [contenteditable]{cursor:text;outline:0}doc-body .inventory-item_price:hover,doc-body .inventory-item_qty:hover,doc-body [contenteditable]:hover{background-color:#D6EDFF}doc-body [data-type=inventory-content]{display:table;border-bottom:1px solid #000}doc-body .inventory-item{display:table-row;page-break-inside:avoid!important}doc-body .inventory-item>doc-part{display:table-cell;vertical-align:top}doc-body .inventory-item:hover .inventory-item_name .remove-btn{opacity:.25}doc-body .inventory-item .inventory-item_name{position:relative;width:100%}doc-body .inventory-item .inventory-item_name .remove-btn{opacity:0;position:absolute;top:0;right:0}doc-body .inventory-item .inventory-item_name .remove-btn:hover{opacity:1}doc-body .twitter-typeahead{display:inline-block;border-right:1px solid #000;border-bottom:1px dashed #999;border-left:1px solid #000;width:100%}doc-body .twitter-typeahead .typeahead{padding:4px;width:100%;outline:0;border:1px solid #fff}doc-body .twitter-typeahead .tt-highlight,doc-body .twitter-typeahead .tt-input{display:inline-block}doc-body .twitter-typeahead .tt-highlight:hover,doc-body .twitter-typeahead .tt-input:hover{background-color:#D6EDFF!important}doc-body .twitter-typeahead .tt-highlight:active,doc-body .twitter-typeahead .tt-highlight:focus,doc-body .twitter-typeahead .tt-input:active,doc-body .twitter-typeahead .tt-input:focus{background-color:transparent!important}doc-body .twitter-typeahead .ta{z-index:1;width:100%;border-top:1px solid #333;border-left:1px solid #333;border-right:1px solid #333}doc-body .twitter-typeahead .tt-menu{z-index:1!important;background-color:#fff;border:1px solid #eee;box-shadow:rgba(0,0,0,.329412) 0 0 5px;cursor:default}
				</style>
				<style>
				[data-template=mike] .inventory-item .inventory-item_name{border-left:1px solid #000}[data-template=mike] .inventory-item .inventory-item_name doc-text{padding:3px 6px}[data-template=mike] .inventory-item .inventory-item_price,[data-template=mike] .inventory-item .inventory-item_qty,[data-template=mike] .inventory-item .inventory-item_total{border-left:1px solid #000;min-width:95px;text-align:center;padding:3px 6px;height:100%}[data-template=mike] .inventory-item .inventory-item_total{border-right:1px solid #000}
				</style>
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