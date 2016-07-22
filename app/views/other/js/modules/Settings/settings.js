Core.addModule('settings', function(context){
	
	var $body = context.element,
		$account = $body.find('[data-type="account-container"]'),
		$job = $body.find('[data-type="job-container"]'),
		$email = $body.find('[data-type="email-container"]'),
		$trash = $body.find('[data-type="trash-container"]');
	
	var request = {
		status: {
			post: `${environment.root}/post/status`,
		},
		email: {
			put: `${environment.root}/put/email-signature`,
		},
		trash: {
			put: `${environment.root}/put/restore`,
			post: `${environment.root}/post/empty-trash`,
		}
	}
	
	// Bind
	context.use('tab');
	bindStatus();
	bindEmail();
	bindTrash();
	speechRender();
	
	function bindStatus(){
		
		new Sortable(document.getElementById('job-status'), {
			handle: '.status-handle',
			animation: 150,
			ghostClass: 'status-hover',
			onEnd: updateStatus,
		});
		
		// New status
		$job.on('click', '[data-type="new-status"]', newStatus);
		
		// Listen to change
		$job.on('change', '.jobstatus ul input', updateStatus);
	}
	
	function newStatus(){
		$job.find('.jobstatus ul').append(`
			<li>
				<input type="text" placeholder="Status name" />
				<div class="status-handle">
				</div>
			</li>
		`);
	}
	
	function updateStatus(){
		var map = [];
		
		// Populate map from DOM
		$job.find('.jobstatus ul input').each(function(){
			
			if($(this).data('id') == undefined){
				if($(this).val()){
					map.push({
						name: $(this).val()
					});
				}
				return true;
			}
			
			if($(this).val()){
				map.push({
					id: $(this).data('id'),
					name: $(this).val(),
				});
			}
		});
		
		$.post(request.status.post, {
			data: map
		}).done(function(){
			Paperwork.send('notification', 'Saved');
		});
	}
	
	function bindEmail(){
		
		// Update email settings based on email domain
		$email.on('blur', '.email-address', function(){
			var address = $(this).val(),
				smtp = $email.find('.email-settings input[name=smtp]'),
				protocol = $email.find('.email-settings input[name=protocol]'),
				port = $email.find('.email-settings input[name=port]');
			
			if(address.indexOf('@gmail') != -1){
				smtp.val('smtp.gmail.com');
				protocol.val('TLS');
				port.val('587');
			}
			
			if(address.indexOf('@hotmail') != -1 || address.indexOf('@live') != -1){
				smtp.val('smtp.live.com');
				protocol.val('');
				port.val('465');
			}
			
			if(address.indexOf('@outlook') != -1){
				smtp.val('smtp-mail.outlook.com');
				protocol.val('TLS');
				port.val('587');
			}
		})
		
		$email.on('click', '.email-signature button', function(){
			$.post(request.email.put, {
				signature: $email.find('.signature').html(),
			}).done(function(){
				Paperwork.goto(`${environment.root}/${environment.page}`);
			});
		});
	}
	
	function bindTrash(){
		
		// Undo trash item
		$trash.on('click', '[data-type="trash"]', function(){
			var id = $(this).data('id'),
				item = $(this).data('item');
			
			if(!id || !item) return;
			undoTrash(id, item);
		});
		
		// Empty trash
		$trash.on('click', '[data-type="empty-trash"]', emptyTrash);
	}
	
	function undoTrash(id, item, callback){
		
		$trash.css('opacity', 0.5);
		$trash.attr('disabled', '');
		
		$.post(request.trash.put, {
			id: id,
			type: item,
		}).done(function(data){
			$trash.css('opacity', 1);
			$trash.removeAttr('disabled');
			$trash.find(`[data-item="${item}"][data-id="${id}"]`).parent().remove();
			if(callback) callback();
		});
	}
	
	function emptyTrash(){
		$trash.css('opacity', 0.5);
		$trash.attr('disabled', '');
		
		$.post(request.trash.post)
		.done(function(response){
			Paperwork.goto(`${environment.root}/${environment.page}`);
		});
	}
	
	function speechRender(){
		
		if(!annyang){
			return $body.find('[data-type="annyang"]').append(`
				<part class="container">
					Your browser has not adopted the Speech Recognition standard yet - sorry!
				</part>
			`);
		}
		
		if(!localStorage.annyang || localStorage.annyang !== 'true'){
			localStorage.annyang = 'false';
			$body.find('[data-type="annyang"]').append(`
				<part class="container">
					Voice control is currently disabled.
				</part>
				<part class="container">
					<button data-type="annyang-switch" class="button">Enable</button>
				</part>
			`);
			
			return bindSpeech();
		}
		
		$body.find('[data-type="annyang"]').append(`
			<part class="container">
				Voice control is currently enabled.
			</part>
			<part class="container">
				<button data-type="annyang-switch" class="button delete">Disable</button>
			</part>
		`);
		
		return bindSpeech();
	}
	
	function bindSpeech(){
		$body.on('click', '[data-type="annyang-switch"]', function(){
			localStorage.annyang = $(this).hasClass('delete') ? 'false' : 'true';
			Paperwork.goto(`${environment.root}/${environment.page}`);
		});
	}
	
});