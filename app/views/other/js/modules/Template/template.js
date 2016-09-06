Core.addModule('template', function(context){
	
	var $body = context.element;
	
	var properties = {};
	var background_colour;
	var image_max_size;
	var timer;
	var top = 0;
	
	var request = {
		get: `${environment.root}/get/template-properties`,
		post: `${environment.root}/post/template`,
		delete: `${environment.root}/delete/template`,
		putProp: `${environment.root}/put/properties`,
		putTemplate: `${environment.root}/put/template`,
		update: `${environment.root}/post/update-template`,
	};
	
	var parse = context.require('parse');
	context.use('tab');
	context.use('document');
	
	var colors = ['#1abc9c', '#16a085', '#2ecc71', '#27ae60', '#3498db', '#2980b9', 
	'#9b59b6', '#8e44ad', '#34495e', '#2c3e50', '#f1c40f', '#f39c12', '#e67e22',
	'#d35400', '#e74c3c', '#c0392b', '#ecf0f1', '#bdc3c7', '#95a5a6', '#7f8c8d', 'white', 'black'];
	
	// Bind
	construct();
	bind();
	getProperties();
	
	function construct(){
		
		// Populate color palettes
		for(let i in colors){
			const value = colors[i];
			
			$body.find('.color-palette').append(`<div class="color" data-color="${value}" style="background-color: ${value}"></div>`);
		}
	}
	
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
		$body.find('[data-type="template-name"]').on('change', function(){
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
			
			if(prop.indexOf('colour') != -1) return;
			$body.find(`[data-property="${prop}"]`).css('background-color', '#D6EDFF');
		});
		
		$body.on('mouseout', '[data-type="row"]', function(){
			var prop = $(this).find('[data-type="key"]').text().trim();
			
			if(prop.indexOf('colour') != -1) return;
			$body.find(`[data-property="${prop}"]`).css('background-color', '');
		});
		
		// color palette click
		$body.on('click', '.color-palette .color', function(){
			var color = $(this).data('color'),
				property = $(this).closest('[data-type="row"]').find('[data-type="key"]').text().trim();
			
			$(this).closest('[data-type="row"]').find('.prop').html(color);
			
			properties[property] = color;
			saveProperties();
			render();
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
		
		if(isNaN(id)) id = 0;
		
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
					<div style="position: relative;overflow: hidden;">
						<div data-type="document" data-id="{{i}}" class="template-document" style="opacity: 0.25;padding: 10mm 0;">
							${request.body}
						</div>
						<div data-type="template-hud" class="template-hud">
							<div class="play-container" style="padding-right: 50mm;">
								<div data-type="previous" class="play-padding">
									<div class="play-left"></div>
								</div>
							</div>
							<div class="play-container" style="padding-left: 50mm;">
								<div data-type="next" class="play-padding">
									<div class="play-right"></div>
								</div>
							</div>
						</div>
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
		
		$body.find('.tabopen .document-owner').css('width', $body.find('.tabopen .document-owner').outerWidth());
		$body.find('.tabopen [data-type="document"]').animate({
			opacity: 0,
			marginLeft: `${(direction * -1)}px`
		}, 100, 'swing', change).css('overflow', 'hidden');
		
		function change(){
			$.post(request.update, {
				id: template_id,
				direction: req,
			}).done(function(response){
				response = JSON.parse(response);
				
				$body.find('.tabopen .document-owner').css('width', 'auto');
				$body.find('.tabopen [data-type="document"]').html(response.body).css({
					opacity: 0,
					marginLeft: `${direction}px`,
					overFlow: 'auto',
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
		
		// Render on keyup
		$body.on('keyup', '[data-type="properties"] .prop', function(){
			var property = $(this).closest('[data-type="row"]').find('[data-type="key"]').text().trim(),
				value;
			
			value = parse.toText($(this));
			properties[property] = value.html().trim();
			saveProperties();
			render();
		});
		
		// Render on blur
		$body.on('blur', '[data-type="properties"] .prop', function(){
			var property = $(this).closest('[data-type="row"]').find('[data-type="key"]').text().trim();
			
			$(this).html(properties[property]);
			render();
		});
		
		// Image upload
		$body.on('change', '[data-type="properties"] [type="file"]', function(){
			
			// Read image to get BASE64 string
			let reader = new FileReader();
			let file = $(this).get(0).files[0];
			
			if(!file) return;
			
			// Return if image is too large
			if(file.size > 257000) {
				console.log(file.size);
				return swal({
					type: 'error',
					title: 'File size larger than 250KB',
					text: `Sorry, that image is too big for Paperwork. We like small images to keep Paperwork fast!`,
				});
			}
			
			reader.readAsDataURL(file);
			reader.onload = function(response){
				
				// Clear image_max_size, image_size
				image_max_size = null;
				properties.image_size = null;
				
				// Update image property
				properties.image = response.target.result;
				saveProperties();
				render();
				
				if(image_max_size){
					properties.image_size = image_max_size;
					$body.find('[data-type="image_size"] .prop').html(image_max_size);
					$body.find('[data-type="properties"] [type="range"]').get(0).value = image_max_size;
				}
			}
		});
		
		// Image size change
		$body.on('input', '[data-type="properties"] [type="range"]', function(){
			
			var size;
			
			// Get scaled image size
			size = $(this).val();
			size = parse.toNumber(size, {
				decimal: 0,
			});
			
			// Update image_size property
			$(this).parent().find('.prop').html(size);
			properties.image_size = size;
			
			saveProperties();
			render();
		});
	}
	
	function render(){
		
		// Re-render document behavior
		Paperwork.send(`document.template.reload`, properties);
		
		// Update image_max_size
		if($body.find('.template-logo').length) image_max_size = $body.find('.template-logo').get(0).naturalWidth;
		
		// Update image_size range max
		if(image_max_size) $body.find('[data-type="properties"] [type="range"]').get(0).max = image_max_size;
	}
	
	function saveProperties(){
		
		// Stop timer
		clearTimeout(timer);
		
		// Start timer, save() after 0.5 seconds
		timer = setTimeout(function(){
			
			$.post(request.putProp, {
				properties: properties,
			});
		}, 500);
	}
});