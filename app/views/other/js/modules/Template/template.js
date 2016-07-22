Core.addModule('template', function(context){
	
	var $body = context.element;
	
	var templates = {};
	var themes = {};
	
	var tab; // Behavior: tab
	var top = 0;
	
	var request = {
		post: `${environment.root}/post/template`,
		put: `${environment.root}/put/template`,
		delete: `${environment.root}/delete/template`,
	};
	
	// Bind
	bind();
	
	function bind(){
		
		var button = {
			create: $body.find('.template-create'),
			select: $body.find('.template-icon'),
			publish: $body.find('.template-publish'),
			delete: $body.find('.template-delete'),
		};
		
		for(let i in button) button[i].off();
		
		tab = context.use('tab');
		
		// Template rename
		$body.find('input.template-name').on('keyup', function(){
			var id = $(this).closest('[data-type="obj"]').data('id');
			
			if(id != '+') $body.find(`[data-type="tab-container"] [data-id="${id}"]`).html($(this).val());
		});
		
		// Template publish
		button.publish.on('click', function(){
			var id = $(this).closest('[data-template-id]').data('template-id'),
				name = $(this).closest('[data-template-id]').find('input.template-name').val(),
				html = $(this).closest('[data-template-id]').find('.template-form').html(),
				$this = $(this),
				text = $(this).html();
			
			$.post(request.put, {
				id: id,
				name: name,
				content: html,
			}).done(function(response){
				response = JSON.parse(response);
				
				Paperwork.ready($this, text);
				Paperwork.send('notification');
			});
		});
		
		// Template delete
		button.delete.on('click', function(){
			var id = $(this).closest('[data-template-id]').data('template-id'),
				_id = $body.find(`[data-template-id=${id}]`).data('id'),
				text = button.delete.html();
			
			swal({
				title: 'Are you sure you want to delete this template?',
				text: 'You can restore this from the trash tab in settings',
				showCancelButton: true,
				closeOnConfirm: true,
			}, function(result){
				if(!result){
					Paperwork.ready(button.delete, text);
					return;
				}
				
				$.post(request.delete, {
					id: id,
				}).done(function(response){
					
					remove(_id);
					delete templates[id];
					
					Paperwork.send(`tab.${context.name}.activate`, 'last');
					Paperwork.send('notification');
				});
			});
			
		});
		
		// Template select
		button.select.on('click', function(){
			var $img = $(this).find('img');
			
			if($img.hasClass('img-active')){
				$img.removeClass('img-active');
				$body.find('.template-shell').val('');
			}else{
				$img.addClass('img-active');
				$body.find('.template-shell').val('1');
			}
			
			$body.find('.template-shell').blur();
		});
		
		// Template create
		button.create.on('click', function(){
			var p = $body.find('[data-type="obj"]').filter('[data-id="+"]');
			var name = p.find('.template-name').val(),
				template = p.find('.img-active').data('name');
			
			$.post(request.post, {
				theme: template,
				name: name,
			}).done(function(data){
				data = JSON.parse(data);
				
				
				p.find('.template-name').val('');
				p.find('.img-active').removeClass('img-active');
				$body.find('.template-shell').val('');
				
				append({
					id: data.id,
					name: data.name,
					content: data.content,
				});
				
				Paperwork.ready($body.find('.template-create'), 'CREATE');
				Paperwork.send(`tab.${context.name}.activate`, 'last');
			});
		});
		
		// New template validation
		Paperwork.validate($body.find('.new-template'), button.create, Paperwork.random(6), {
			allowDuplicates: true,
		});
	}
	
	function append(request){
		
		var $tabs = $body.find('[data-type="tab-container"] ul'),
			$obj = $body.find('[data-type="obj-container"]');
		var id;
		
		// ID
		id = $tabs.children().last().prev().data('id') + 1;
		
		$tabs.children().last().before(`
			<li data-type="tab" data-id="${id}" class="tab">${request.name}</li>
		`);
		
		$obj.children().last().before(`
			<box data-type="obj" data-id="${id}" data-template-id="${request.id}" class="tabobj">
				<div class="container wrap">
					<div class="left" style="width: 33%;">
						<input type="text" class="template-name" placeholder="${request.name}" value="${request.name}">
					</div>
				</div>
				<hr>
				<div class="container template-form">
					${request.content}
				</div>
				<hr>
				<div class="container wrap">
					<ul class="list-inline left">
						<li>
							<button class="button template-publish">PUBLISH</button>
						</li>
					</ul>
					<ul class="list-inline right">
						<li>
							<button class="button delete template-delete">DELETE</button>
						</li>
					</ul>
				</div>
			</box>
		`);
		
		Paperwork.send(`tab.${context.name}.activate`, id);
		
	}
	
	function remove(id){
		$body.find(`[data-id="${id}"]`).remove();
	}
	
});