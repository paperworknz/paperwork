Core.addBehavior('document', function(context, opt){
	
	var $body = context.element;
	
	var request = {
		put: `${environment.root}/put/document`,
		postInventory: `${environment.root}/post/inventory`,
	};
	
	var timer;
	var properties = [];
	var documents = [];
	var inventory = {
		origin: {},
		flat: [],
	};
	
	var parse = context.require('parse');
	
	require();
	
	function require(){
		$.get(`${environment.root}/get/inventory`, function(inventory_response){
			$.get(`${environment.root}/get/document/${job.job_id}`, function(document_response){
				$.get(`${environment.root}/get/template-properties`, function(property_response){
					
					documents = JSON.parse(document_response);
					properties = JSON.parse(property_response);
					inventory.origin = JSON.parse(inventory_response);
					for(let i in inventory.origin) inventory.flat.push(inventory.origin[i].name);
					
					if($body.find('[data-type="document"]').length > 0) loop();
				});
			});
		});
	}
	
	function save(document_id){
		
		// Stop timer
		clearTimeout(timer);
		
		// Start timer, save() after 2 seconds
		timer = setTimeout(function(){
			$.post(request.put, {
				id: document_id,
				document: documents[document_id],
			});
		}, 500);
	}
	
	function loop(){
		
		bindTypeahead();
		renderProperties();
		bindAspects();
		bindInventoryContent();
		render();
		
		// Loop through each document once on load
		$body.find('[data-type="document"]').each(function(){
			
			var template_name = $(this).find('[data-template]').data('template'),
				document_id = $(this).data('id');
			
			if($(`[data-css="${template_name}"]`).length < 1){
				$(`<link data-css="${template_name}" type="text/css" rel="stylesheet">`)
				.appendTo('head')
				.attr('href', `${environment.root}/css/templates/${template_name}.css`);
			}
			
			// Set empty item array if null
			if(documents[document_id].items == null) documents[document_id].items = [];
			
			$(this).css('pointer-events', 'auto').animate({
				opacity: 1
			}, 500);
		});
	}
	
	function bindTypeahead(){
		
		// Instantiate typeahead
		$body.find('[data-type="document"] [data-type="inventory-input"]').html(`
			<input type="text" class="typeahead" placeholder="Item">
		`).find('.typeahead').typeahead({
			hint: true,
			highlight: true,
			minLength: 1,
		}, {
			source: substringMatcher(inventory.flat),
		});
		
		// Add listeners
		$body.off('typeahead:select', '[data-type="document"] .tt-input');
		$body.on('typeahead:select', '[data-type="document"] .tt-input', function(){
			var document_id = $(this).closest('[data-type="document"]').data('id');
			
			// Ignore enter key
			if(event.which == 13) return;
				
			append({
				document_id: document_id,
				name: $(this).val(),
			});
			render();
			
			// Clear typeahead
			$(this).typeahead('val', '');
		});
		
		$body.off('keydown', `[data-type="document"] .tt-input`);
		$body.on('keydown', `[data-type="document"] .tt-input`, function(){
			var document_id = $(this).closest('[data-type="document"]').data('id');
			
			// Cancel if not enter key
			if(event.which != 13) return;
			
			append({
				document_id: document_id,
				name: $(this).val(),
			});
			render();
			
			// Clear typeahead
			$(this).typeahead('val', '');
			
			// Prevent enter from doing bad things
			if(event.which == 13) event.preventDefault();
		});
	}
	
	function renderProperties(){
		
		// Render user template properties
		for(let i in properties){
			$body.find(`[data-type="document"] [data-property="${i}"]`).html(properties[i]);
		}
	}
	
	function bindAspects(){
		
		// Bind any and all aspects
		$body.off('keyup', '[data-type="document"] [data-aspect]');
		$body.on('keyup', '[data-type="document"] [data-aspect]', function(){
			var document_id = $(this).closest('[data-type="document"]').data('id'),
				aspect = $(this).data('aspect'),
				value = $(this).html().trim();
			
			// Update document object and save
			documents[document_id][aspect] = value;
			save(document_id);
		});
	}
	
	function bindInventoryContent(){
		
		let parent = '[data-type="document"] [data-type="inventory-content"]';
		
		// Bind enter/return to blur
		$body.on('keydown', `${parent} [data-type="name"], ${parent} [data-type="quantity"], ${parent} [data-type="price"]`, function(){
			if(event.which != 13) return;
			
			event.preventDefault();
			event.stopPropagation();
			
			return $(this).blur();
		});
		
		// Bind update on blur
		$body.off('blur', `${parent} [data-type="name"], ${parent} [data-type="quantity"], ${parent} [data-type="price"]`);
		$body.on('blur', `${parent} [data-type="name"], ${parent} [data-type="quantity"], ${parent} [data-type="price"]`, function(){
			var document_id = $(this).closest('[data-type="document"]').data('id'),
				type = $(this).data('type'),
				index = $(this).closest('.inventory-item').index(),
				value = $(this).text().trim();
			
			// Update document object and save
			let existing = documents[document_id].items[index][type];
			
			if(existing != value){
				documents[document_id].items[index][type] = value;
				save(document_id);
				render();
			}
		});
		
		// Bind inventory remove button
		$body.off('click', `${parent} [data-type="remove"]`);
		$body.on('click', `${parent} [data-type="remove"]`, function(){
			var document_id = $(this).closest('[data-type="document"]').data('id'),
				index = $(this).closest('.inventory-item').index();
			
			// Remove item from items array, save, and render
			documents[document_id].items.splice(index, 1);
			save(document_id);
			render();
		});
	}
	
	function append({document_id, name = '', quantity = '', price = ''}){
		
		var itemInInventory = false;
		
		// Check for item in inventory and get price
		for(let i in inventory.origin){
			const value = inventory.origin[i];
			
			if(value.name == [name]){
				price = value.price;
				itemInInventory = true;
				break;
			}
		}
		
		// Normalise price
		if(price == '0.00') price = '';
		
		// Append item
		documents[document_id].items.push({
			name: name,
			quantity: quantity,
			price: price,
		});
		
		// Save document
		save(document_id);
		
		// Detect a new inventory item, depends on SweetAlert
		if(!itemInInventory && name.length){
			swal({
				html: true,
				title: `Add ${name} to your inventory?`,
				text: 'If you save this item you can use it again in future.',
				showCancelButton: true,
				closeOnConfirm: true,
				cancelButtonText: 'No',
				confirmButtonText: 'Yes',
			}, function(response){
				
				if(!response) return;
				
				$.post(request.postInventory, {
					name: name,
					price: '0.00',
				}).done(function(response){
					
					response = JSON.parse(response);
					
					inventory.origin.push({
						name: name,
						price: '0.00',
					});
					
					inventory.flat.push(name);
					
					bindTypeahead();
				});
			});
		}
		
		render();
	}
	
	function calculate(document_id){
		
		var document = $body.find('[data-type="document"]').filter(`[data-id="${document_id}"]`);
		var subTotal = 0;
		
		for(let i in documents[document_id].items){
			const value = documents[document_id].items[i];
			
			let quantity = parse.toNumber(value.quantity, {
				decimal: 2,
			});
			
			let price = parse.toNumber(value.price, {
				decimal: 2,
			});
			
			let total = quantity * price;
			
			subTotal += total;
			
			value.quantity = quantity;
			value.price = parse.toDollar(price);
			value.total = parse.toDollar(total);
		}
		
		documents[document_id]['sub-total'] = parse.toDollar(subTotal);
		documents[document_id].tax = parse.toDollar((subTotal / 100) * 15);
		documents[document_id].total = parse.toDollar(subTotal + ((subTotal / 100) * 15));
	}
	
	function render(){
		
		// Loop each document
		for(let i in documents){
			const value = documents[i];
			var document = $body.find(`[data-type="document"]`).filter(`[data-id="${i}"]`);
			
			// Calculate document
			calculate(i);
			
			// Render aspects
			for(let aspect in value){
				document.find(`[data-aspect="${aspect}"]`).html(value[aspect]);
			}
			
			// Render items
			document.find('[data-type="inventory-content"]').html('');
			for(let i in value.items){
				const item = value.items[i];
				
				document.find('[data-type="inventory-content"]').append(`
					<doc-section class="inventory-item">
						<doc-part class="inventory-item_name">
							<doc-text data-type="name">
								${item.name}
							</doc-text>
							<doc-part data-type="remove" class="remove-btn"></doc-part>
						</doc-part>
						<doc-part class="inventory-item_qty">
							<doc-text data-type="quantity">
								${item.quantity}
							</doc-text>
						</doc-part>
						<doc-part class="inventory-item_price">
							<doc-text data-type="price">
								${item.price}
							</doc-text>
						</doc-part>
						<doc-part class="inventory-item_total">
							<doc-text data-type="item-total">
								${item.total}
							</doc-text
						</doc-part>
					</doc-section>
				`);
			}
		}
		
		// Set contenteditable on all aspects globally
		$body.find('[data-type="document"]')
			.find('[data-aspect="name"], [data-aspect="date"], [data-aspect="description"]')
			.attr('contenteditable', 'true');
		
		// Set contenteditable on all inventory items globally
		$body.find('[data-type="document"] [data-type="inventory-content"] .inventory-item')
			.find('[data-type="name"], [data-type="quantity"], [data-type="price"]')
			.attr('contenteditable', 'true');
	}
});