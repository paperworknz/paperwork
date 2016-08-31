Core.addBehavior('document', function(context, opt){
	
	var $body = context.element;
	
	var request = {
		put: `${environment.root}/put/document`,
		postInventory: `${environment.root}/post/inventory`,
	};
	
	var job_id;
	var timer;
	var properties = [];
	var documents = [];
	var inventory = {
		origin: {},
		flat: [],
	};
	
	var parse = context.require('parse');
	var caret = context.require('caret');
	
	listen();
	onload();
	
	function listen(){
		
		// Update existing, or new, documents
		// - accepts an array/object of standard document objects
		Paperwork.on('document.build', function(request){
			
			if(typeof request !== 'object' || request === null){
				return console.warn('New document request not an object');
			}
			
			// Loop all documents in the request
			for(let i in request){
				
				// Merge this document with documents object and build
				documents[i] = request[i];
				build(i);
				save(i);
			}
		});
		
		// Update properties and reload all existing documents
		// - accepts a properties object (optional)
		Paperwork.on(`document.${context.name}.reload`, function(request){
			
			if(typeof request === 'object' && request !== null){
				properties = request;
			}
			
			// Loop through each document
			$body.find('[data-type="document"]').each(function(){
				
				var document_id = $(this).data('id');
				
				build(document_id);
			});
		});
		
		// Save a document by id
		// - accepts a document_id
		Paperwork.on(`document.${context.name}.save`, function(request){
			if(!parse.toNumber(request)) return console.warn('Document ID not supplied');
			
			save(request, function(){
				Paperwork.send('notification');
			});
		});
	}
	
	function onload(){
		
		job_id = typeof job == 'undefined' ? 0 : job.job_id;
		
		$.get(`${environment.root}/get/inventory`, function(inventory_response){
			$.get(`${environment.root}/get/document/${job_id}`, function(document_response){
				$.get(`${environment.root}/get/template-properties`, function(property_response){
					
					documents = JSON.parse(document_response);
					properties = JSON.parse(property_response);
					inventory.origin = JSON.parse(inventory_response);
					for(let i in inventory.origin) inventory.flat.push(inventory.origin[i].name);
					
					// Loop through each document once on load
					$body.find('[data-type="document"]').each(function(){
						
						var document_id = $(this).data('id');
						
						build(document_id);
					});
				});
			});
		});
	}
	
	function build(document_id){
		
		var $doc = $body.find(`[data-type="document"][data-id="${document_id}"]`),
			template_name = $doc.find('[data-template]').data('template');
		
		// Load template CSS
		if($(`[data-css="${template_name}"]`).length < 1){
			$(`<link data-css="${template_name}" type="text/css" rel="stylesheet">`)
			.appendTo('head')
			.attr('href', `${environment.root}/css/templates/${template_name}.css`);
		}
		
		// Set empty item array if null
		if(documents[document_id]) if(documents[document_id].items == null) documents[document_id].items = [];
		
		renderProperties(document_id);
		if(documents[document_id]) bindTypeahead(document_id);
		if(documents[document_id]) bindAspects(document_id);
		if(documents[document_id]) bindInventoryContent(document_id);
		render(document_id);
		
		$doc.css('pointer-events', 'auto').animate({
			opacity: 1
		}, 250);
	}
	
	function bindTypeahead(document_id){
		
		var $doc = `[data-type="document"][data-id="${document_id}"]`;
		
		// Instantiate typeahead
		$body.find(`${$doc} [data-type="inventory-input"]`).html(`
			<input type="text" class="typeahead" placeholder="Item">
		`).find('.typeahead').typeahead({
			hint: true,
			highlight: true,
			minLength: 1,
		}, {
			source: substringMatcher(inventory.flat),
		});
		
		// Add listeners
		$body.off('typeahead:select', `${$doc} .tt-input`);
		$body.on('typeahead:select', `${$doc} .tt-input`, function(){
			
			// Ignore enter key
			if(event.which == 13) return;
				
			append({
				document_id: document_id,
				name: $(this).val(),
			});
			
			render(document_id);
			
			// Clear typeahead
			$(this).typeahead('val', '');
			$(this).focus();
		});
		
		$body.off('keydown', `${$doc} .tt-input`);
		$body.on('keydown', `${$doc} .tt-input`, function(){
			
			// Cancel if not enter key
			if(event.which != 13) return;
			
			append({
				document_id: document_id,
				name: $(this).val(),
			});
			
			render(document_id);
			
			// Clear typeahead
			$(this).typeahead('val', '');
			
			// Prevent enter from doing bad things
			if(event.which == 13) event.preventDefault();
			
			setTimeout(function(){
				$body.find(`${$doc} .typeahead`).focus();
			}, 0)
		});
	}
	
	function renderProperties(document_id){
		
		var $doc = `[data-type="document"][data-id="${document_id}"]`;
		
		// Render user template properties
		for(let i in properties){
			var value = properties[i];
			var $prop = $body.find(`${$doc} [data-property="${i}"]`);
			
			for(let aspect in documents[document_id]){
				
				if(value.indexOf(`@${aspect}`) !== -1){
					value = value.replace(`@${aspect}`, `<div data-aspect="${aspect}" style="display: inline;"></div>`);
				}
			}
			
			// Set prop value in templates
			if(i == 'background_colour') $prop.css('background-color', (value || 'white'));
			if(i == 'text_colour') $prop.css('color', (value || 'white'));
			if(i.indexOf('colour') == -1) $prop.html(value);
		}
	}
	
	function bindAspects(document_id){
		
		var $doc = `[data-type="document"][data-id="${document_id}"]`;
		
		// Bind any and all aspects
		$body.off('keyup', `${$doc} [data-aspect]`);
		$body.on('keyup', `${$doc} [data-aspect]`, function(){
			var aspect = $(this).data('aspect'),
				value;
			
			// Update document object and save
			value = parse.toText($(this));
			documents[document_id][aspect] = value.html().trim();
			save(document_id);
		});
	}
	
	function bindInventoryContent(document_id){
		
		var $doc = `[data-type="document"][data-id="${document_id}"]`;
		let parent = `${$doc} [data-type="inventory-content"]`;
		
		// Bind enter/return to blur for name, qty, price
		$body.on('keydown', `${parent} [data-type="quantity"], ${parent} [data-type="price"]`, function(){
			if(event.which != 13) return;
			
			event.preventDefault();
			event.stopPropagation();
			
			return $(this).blur();
		});
		
		// Bind update on blur
		$body.off('blur', `${parent} [data-type="name"], ${parent} [data-type="quantity"], ${parent} [data-type="price"]`);
		$body.on('blur', `${parent} [data-type="name"], ${parent} [data-type="quantity"], ${parent} [data-type="price"]`, function(){
			var type = $(this).data('type'),
				index = $(this).closest('.inventory-item').index(),
				value,
				existing;
			
			// Get normalised html
			value = parse.toText($(this));
			existing = documents[document_id].items[index][type];
			
			// Do not re-render/save if value hasn't changed
			if(existing == value) return;
			
			// Update document object and save
			documents[document_id].items[index][type] = value.html().trim();
			save(document_id);
			render(document_id);
			
			// Anticipate next clicked contenteditable and focus at end
			// Without this, the click would not register due to re-rendering the DOM
			setTimeout(function(){
				caret.end('[contenteditable]:hover');
			}, 0);
		});
		
		// Bind inventory remove button
		$body.off('click', `${parent} [data-type="remove"]`);
		$body.on('click', `${parent} [data-type="remove"]`, function(){
			var index = $(this).closest('.inventory-item').index();
			
			// Remove item from items array, save, and render
			documents[document_id].items.splice(index, 1);
			save(document_id);
			render(document_id);
		});
	}
	
	function append({document_id, name = '', quantity = '', price = '', margin = 1}){
		
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
			margin: margin,
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
		
		render(document_id);
	}
	
	function calculate(document_id){
		
		var $doc = $body.find(`[data-type="document"][data-id="${document_id}"]`);
		var subtotal = 0;
		
		for(let i in documents[document_id].items){
			const value = documents[document_id].items[i];
			
			if(!value.hasOwnProperty('margin')) value.margin = 1;
			
			let quantity = parse.toNumber(value.quantity, {
				decimal: 2,
			});
			
			let price = parse.toNumber(value.price, {
				decimal: 2,
			});
			
			let margin = parse.toNumber(value.margin, {
				decimal: 2,
			});
			
			let total;
			
			// Calculating
			total = quantity * (price * margin);
			total = parse.toNumber(total, {
				decimal: 2,
			});
			
			if(total) subtotal += Number(total);
			
			// Update document object
			value.quantity = quantity;
			value.price = price;
			value.total = total;
			value.margin = margin;
		}
		
		documents[document_id].subtotal = parse.toNumber(subtotal, {
			decimal: 2,
		});
		
		documents[document_id].tax = parse.toNumber(((documents[document_id].subtotal / 100) * job.tax), {
			decimal: 2,
		});
		
		documents[document_id].total = parse.toNumber(
			(documents[document_id].subtotal + documents[document_id].tax), 
			{
				decimal: 2,
			}
		);
	}
	
	function render(document_id){
		
		const value = documents[document_id];
		var $doc = $body.find(`[data-type="document"]`).filter(`[data-id="${document_id}"]`);
		
		// Calculate document
		if(documents[document_id]) calculate(document_id);
		
		// Render aspects
		for(let aspect in value){
			
			let dollar = ['subtotal', 'tax', 'total'];
			let prop = value[aspect];
			
			if(dollar.indexOf(aspect) != -1) {
				prop = parse.toDollar(prop);
			}
			
			$doc.find(`[data-aspect="${aspect}"]`).html(prop);
		}
		
		if(!documents[document_id]) return;
		
		// Render items
		$doc.find('[data-type="inventory-content"]').html('');
		
		for(let i in value.items){
			const item = value.items[i];
			
			// Format item properties
			let margin = item.margin;
			let quantity = item.quantity;
			let price = item.price;
			let total = item.total;
			
			// Calculate margin (for display)
			if(price) price = price * margin;
			
			// Format numbers
			quantity = parse.toNumber(quantity, {
				decimal: 2,
				natural: true,
			});
			price = parse.toDollar(price);
			total = parse.toDollar(total);
			if(quantity === 0) quantity = '0.00';
			if(price === '$0') price = '$0.00';
			if(total === '$0') total = '$0.00';
			
			if(!quantity || !price) total = '';
			
			$doc.find('[data-type="inventory-content"]').append(`
				<doc-section class="inventory-item wrap">
					<doc-part class="inventory-item_name">
						<doc-text data-type="name">
							${item.name}
						</doc-text>
						<doc-part data-type="remove" class="remove-btn"></doc-part>
					</doc-part>
					<doc-part data-type="quantity" class="inventory-item_qty">
						${quantity}
					</doc-part>
					<doc-part data-type="price" class="inventory-item_price">
						${price}
					</doc-part>
					<doc-part data-type="item-total" class="inventory-item_total">
						${total}
					</doc-part>
				</doc-section>
			`);
		}
		
		// Set contenteditable on all aspects globally
		$doc.find('[data-aspect="name"], [data-aspect="date"], [data-aspect="reference"], [data-aspect="description"]')
			.attr('contenteditable', 'true');
		
		// Set contenteditable on all inventory items globally
		$doc.find('[data-type="inventory-content"] .inventory-item')
			.find('[data-type="name"], [data-type="quantity"], [data-type="price"]')
			.attr('contenteditable', 'true');
	}
	
	function save(document_id, callback){
		
		// Stop timer
		clearTimeout(timer);
		
		// Start timer, save() after 0.5 seconds
		timer = setTimeout(function(){
			$.post(request.put, {
				id: document_id,
				document: documents[document_id],
			}).done(function(response){
				
				if(callback instanceof Function) callback();
			});
		}, 500);
	}
	
	function returnDocuments(request){
		if(!request) return documents;
		
		if(!parse.toNumber(request)){
			console.warn(`NaN provided while getting documents under context: ${context.name}`);
			return;
		}
		
		return documents[request];
	}
	
	return {
		documents: returnDocuments,
		properties: function(){
			return properties;
		},
	}
});