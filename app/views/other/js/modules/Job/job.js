Core.addModule('job', function(context){
	
	var $body = context.element;
	context.use('tab');
	
	var form;
	
	var request = {
		job: {
			putDetails: `${environment.root}/put/job-details`,
		},
		form: {
			getPDFList: `${environment.root}/get/pdf-json/${job.job_number}`,
			post: `${environment.root}/post/form`,
			put: `${environment.root}/put/form`,
			delete: `${environment.root}/delete/form`,
		},
	};
	
	construct();
	
	function construct(){
		form = new Form;
		getPDFList();
		bind();
	}
	
	function bind(){
		jobName();
		jobDelete();
		changeStatus();
		notes();
		formBind();
	}
	
	function getPDFList(){
		Paperwork.wait($body.find('.pdf-load'));
		$.get(request.form.getPDFList)
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
	
	function changeStatus(){
		$body.on('change', '.status', function(){
			if($(this).val() == undefined) return;
			
			$.post(request.job.putDetails, {
				id: job.job_id,
				status: $(this).val()
			}).done(function(response){
				if(response == '0') return Paperwork.send('notification', 'Failed to save');
				
				Paperwork.send('notification', 'Saved');
				if(response == 'Completed') Paperwork.goto(`${environment.root}/${environment.page}`);
			});
		});
	}
	
	function jobName(){
		
		// Change job name
		$body.find('.job-name').change(function(){
			if($('.job-name').val() == '') return;
			
			$.post(request.job.putDetails, {
				name: $('.job-name').val(),
				id: job.job_id,
			}).done(function(){
				Paperwork.send('notification', 'Saved');
			});
		});
	}
	
	function jobDelete(){
		$body.on('click', '.button.delete', function(){
			var $this = $(this);
			
			swal({
				title: 'Are you sure you want to delete this job?',
				text: 'Deleting this job will delete ALL quotes and invoices attached',
				showCancelButton: true,
				closeOnConfirm: true,
			}, function(response){
				if(!response) return Paperwork.ready($this, 'Delete Job');
				
				$body.find('[job-del-form]').submit();
			});
		});
	}
	
	function notes(){
		
		var notes = $body.find('.notepad').html();
		
		// Focus notes
		$body.find('.note-wrap').on('click', function(){
			$body.find('.notepad').focus();
		});
		
		// Notes change
		$body.find('.notepad').on('blur', function(){
			if($(this).html() == notes) return;
			
			$.post(request.job.putDetails, {
				notes: $(this).html(),
				id: job.job_id,
			}).done(function(){
				notes = $body.find('.notepad').html();
				Paperwork.send('notification', 'Notes saved');
			});
		});
	}
	
	function formBind(){
		
		var timer;
		
		// FORM.POST()
		$body.on('click', '[new-template]', function(){
			var button = $(this),
				name = $(this).html();
			
			Paperwork.wait(button);
			form.post({
				url: request.form.post,
				template_name: name,
				template_id: button.attr('data-templateid'),
				client_id: job.client_id,
				job_id: job.job_id,
				job_number: job.job_number,
			}, function(bool){
				if(!bool) return;
				
				Paperwork.ready(button, name);
				$body.find(form.s).find('[form-blob]').removeClass('form-loading');
				$body.find(form.s).find('.tt-input').focus();
			});
		});
		
		// FORM.PUT()
		$body.on('click', '[form-save-btn]', function(){
			var button = $(this);
			
			form.put({
				url: request.form.put,
				id: $body.find(form.s).find('[form-blob]').attr('data-formid'),
			}, function(bool){
				if(!bool){
					Paperwork.ready(button, 'SAVE');
					Paperwork.saved('Failed to save');
					return;
				}
				
				Paperwork.ready(button, 'SAVE');
				Paperwork.send('notification', 'Saved');
			});
		});
		
		// FORM.DELETE()
		$body.on('click', '[form-del-btn]', function(){
			var button = $(this);
			
			$body.find(`${form.s} ${form.form}`).addClass('form-loading');
			swal({
				title: 'Are you sure you want to delete this?',
				text: 'Deleting this will remove it forever',
				showCancelButton: true,
				closeOnConfirm: true,
			}, function(response){
				
				if(!response) return Paperwork.ready(button, 'DELETE');
				
				form.delete({
					url: request.form.delete,
					form_id: $body.find(form.s).find('[form-blob]').attr('data-formid'),
				}, function(){
					var noteposition = $body.find('.notes').position(),
						noteparent = $body.find('.notes').clone(),
						tab_id = $body.find('[data-type="tab-container"] .active').data('id');
					
					$body.find('.notes').css({
						position: 'absolute',
						top: noteposition.top,
						left: noteposition.left,
					});
					$body.find(form.s).slideUp('fast', function(){
						$body.find(form.s).remove();
						$body.find(`[data-type="tab-container"] [data-id="${tab_id}"]`).fadeOut('fast', function(){
							Paperwork.send('tab.job.activate', $body.find(`[data-type="tab-container"] [data-id="${tab_id}"]`).prev().data('id'));
							
							$body.find('.notes').replaceWith(noteparent);
							$body.find('.note-wrap').on('click', function(){
								$body.find('.notepad').focus();
							});
							$(this).remove();
						});
					});
				});
				
			});
		});
		
		// FORM.PDF()
		$body.on('click', '[form-pdf-btn]', function(){
			var button = $(this),
				html = button.html();
			
			form.put({
				url: request.form.put,
				id: $body.find(form.s).find('[form-blob]').attr('data-formid'),
			}, function(response){
				
				if(!response){
					Paperwork.ready(button, html);
					return Paperwork.send('notification', 'Error making PDF');
				}
				
				form.pdf($body.find(form.s).find('[form-blob]'), function(name, data){
					
					$body.find(form.s).find('[form-pdf-name]').val(name);
					$body.find(form.s).find('[form-pdf-html]').val(data);
					$body.find(form.s).find('[form-pdf-form]').submit();
					
					window.onfocus = function(){
						Paperwork.ready($body.find('[form-pdf-btn]'), 'PDF');
					};
					
				});
			});
		});
		
		// FORM.COPY()
		$body.on('click', '[form-copy-btn]', function(){
			form.copy($body.find(`${form.s} [form-blob]`), templates);
		});
		
		// MARGIN
		$body.on('click', '[form-margin-btn]', function(){
			form.margin($body.find(`${form.s} [form-blob]`));
		});
		
		// EMAIL
		$body.on('click', '[form-email-btn]', function(){
			form.email($body.find(`${form.s} [form-blob]`));
			// Paperwork.validate($body.find('.email-parent'), $('body [email-send]'), 'email');
		});
		
		// FORM PUT after 2 seconds after last keyup
		$body.on('keyup', '[form-blob] [contenteditable]', function(){
			clearTimeout(timer);
			timer = setTimeout(function(){
				form.put({
					url: request.form.put,
					id: $body.find(form.s).find('[form-blob]').attr('data-formid'),
				});
			}, 2000);
		});
	}
	
});