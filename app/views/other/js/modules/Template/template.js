Core.addModule('template', function(context){
	
	var $body = context.element;
	
	var properties = {};
	var top = 0;
	
	var request = {
		get: `${environment.root}/get/template-properties`,
		update: `${environment.root}/post/update-template`,
		post: `${environment.root}/post/template`,
		delete: `${environment.root}/delete/template`,
		putProp: `${environment.root}/put/properties`,
		putTemplate: `${environment.root}/put/template`,
	};
	
	// Bind
	context.use('tab');
	bind();
	getProperties();
	
	function bind(){
		
		var button = {
			select: $body.find('.template-icon'),
			delete: $body.find('.template-delete'),
			create: $body.find('[data-type="template-create"]'),
			update: $body.find('[data-type="properties-update"]'),
		};
		
		for(let i in button) button[i].off();
		
		// Template/tab sync
		$body.find('[data-type="template-name"]').on('keyup', function(){
			var id = $(this).closest('[data-type="obj"]').data('id');
			
			render();
			if(id != '+') $body.find(`[data-type="tab-container"] [data-id="${id}"]`).html($(this).val());
		});
		
		// Template rename and save
		$body.find('[data-type="template-name"]').on('blur', function(){
			var id = $(this).closest('[data-template-id]').data('template-id'),
				name = $(this).val().trim();
			
			$.post(request.putTemplate, {
				id: id,
				name: name,
			}).done(function(response){
				
				render();
				Paperwork.send('notification');
			});
		});
		
		// Template create
		button.create.on('click', function(){
			var name = $body.find('.new-template [data-type="new-template-name"]').val().trim();
			
			$.post(request.post, {
				name: name,
			}).done(function(response){
				var data = JSON.parse(response);
				
				$body.find('.new-template [data-type="new-template-name"]').val('');
				
				append({
					id: data.id,
					name: data.name,
					body: data.body,
				});
				
				Paperwork.ready($body.find('[data-type="template-create"]'), 'CREATE');
				// Paperwork.send(`tab.${context.name}.activate`, 'last');
			});
		});
		
		// New template validation
		Paperwork.validate($body.find('.new-template'), button.create, Paperwork.random(6), {
			allowDuplicates: true,
		});
		
		// Get template
		$body.on('click', '[data-type="previous"]', function(){
			getTemplate('previous');
		});
		
		$body.on('click', '[data-type="next"]', function(){
			getTemplate('next');
		});
		
		// Hover properties -> data
		$body.on('mouseover', '[data-type="row"]', function(){
			var prop = $(this).find('[data-type="key"]').text().trim();
			
			$body.find(`[data-property="${prop}"]`).css('background-color', '#D6EDFF');
		});
		
		$body.on('mouseout', '[data-type="row"]', function(){
			var prop = $(this).find('[data-type="key"]').text().trim();
			
			$body.find(`[data-property="${prop}"]`).css('background-color', '');
		});
		
		// Save properties
		propertiesUpdate();
	}
	
	function append(request){
		
		var id,
			$tabs = $body.find('[data-type="tab-container"] ul'),
			$obj = $body.find('[data-type="obj-container"]');
		
		// ID
		id = $tabs.children().last().prev().data('id') + 1;
		
		$tabs.children().last().before(`
			<li data-type="tab" data-id="${id}" class="tab" style="opacity: 0.5;">${request.name}</li>
		`);
		
		$body.find('[data-type="tab"]').filter(`[data-id="${id}"]`).animate({
			opacity: 1,
		}, 300, 'swing');
		
		$obj.children().last().before(`
			<box data-type="obj" data-id="${id}" data-template-id="${request.id}" class="tabobj">
				<div class="template-container">
					<div class="container">
						<input type="text" class="template-name" data-type="template-name" placeholder="Template name" value="${request.name}" required>
					</div>
					<hr>
					<div data-type="template-document" class="template-document">
						${request.body}
					</div>
				</div>
			</box>
		`);
		
		render();
		Paperwork.send(`tab.${context.name}.activate`, id);
	}
	
	function remove(id){
		$body.find(`[data-id="${id}"]`).remove();
	}
	
	function getTemplate(req){
		var template_id = $body.find('.tabopen').data('template-id'),
			direction;
		
		req == 'previous' ? direction = '-10' : direction = '10';
		
		$body.find('.tabopen [data-type="template-document"]').animate({
			opacity: 0,
			marginLeft: `${(direction * -1)}px`
		}, 100, 'swing', change);
		
		function change(){
			$.post(request.update, {
				id: template_id,
				direction: req,
			}).done(function(response){
				response = JSON.parse(response);
				
				$body.find('.tabopen [data-type="template-document"]').html(response.body).css({
					opacity: 0,
					marginLeft: `${direction}px`,
				}).animate({
					opacity: 1,
					marginLeft: 0,
				}, 100, 'swing');
				
				render();
			});
		}
	}
	
	function getProperties(){
		
		$.get(request.get)
		.done(function(response){
			response = JSON.parse(response);
			properties = response;
			
			render();
		});
	}
	
	function propertiesUpdate(){
		$body.on('keyup', '[data-type="properties"] input', function(){
			properties[$(this).closest('[data-type="row"]').find('[data-type="key"]').text().trim()] = $(this).val();
			
			render();
		});
		
		$body.on('blur', '[data-type="properties"] input', function(){
			
			$.post(request.putProp, {
				properties: properties,
			}).done(function(response){
				Paperwork.send('notification');
			});
		});
	}
	
	function render(){
		
		// Update each template's name property
		$body.find('[data-type="template-document"]').each(function(){
			$(this).find('[data-property="name"]').html($(this).closest('[data-template-id]').find('[data-type="template-name"]').val());
		});
		
		// Update all properties from properties object
		for(let i in properties){
			const value = properties[i];
			const $prop = $body.find(`[data-type="template-document"] [data-property="${i}"]`);
			
			// Set prop value in templates
			$prop.html(value);
			
			// Render side panel
			$body.find(`[data-type="properties"] [data-type="${i}"]`).val(value);
		}
	}
	
});