Core.addModule('inventory', function(context){
	
	var $body = context.element,
		$list = $body.find('.inventory-list');
	
	var request = {
		put: `${environment.root}/put/inventory`,
		post: `${environment.root}/post/inventory`,
		delete: `${environment.root}/delete/inventory`,
	};
	
	var inventory = {};
	
	// Bind
	loadInventoryFromDOM();
	inlineUpdate();
	render();
	$body.on('click', '.inventory-add .button', addFromButton);
	$body.on('click', '[data-type="remove"]', remove);
	Paperwork.on('inventory.add', add);
	Paperwork.validate($body.find('.inventory-add'), $body.find('.inventory-add .button'), Paperwork.random(6), {
		allowDuplicates: true,
	});
	
	$body.on('keyup', '.filter', filter);
	
	function filter(){
		var query = $body.find('.filter').val().toLowerCase();
		
		for(let i in inventory){
			const value = inventory[i];
			let name = value.name.toLowerCase();
			
			value.display = name.indexOf(query) === -1 ? false : true;
		}
		
		render();
	}
	
	function loadInventoryFromDOM(){
		$body.find('[data-id]').each(function(){
			var id = $(this).data('id'),
				name = $(this).find('input[name="name"]').val(),
				price = $(this).find('input[name="price"]').val();
			
			inventory[id] = {
				display: true,
				name: name,
				price: price,
			};
		});
	}
	
	function addFromButton(){
		var $name = $body.find('.inventory-add input[name="name"]'),
			$price = $body.find('.inventory-add input[name="price"]');
		
		$.post(request.post, {
			name: $name.val(),
			price: $price.val(),
		}).done(function(item){
			item = JSON.parse(item);
			
			// Reset interface
			Paperwork.ready($body.find('.inventory-add .button'), 'ADD');
			$name.val('');
			$price.val('');
			$name.focus();
			
			// Send inventory.add event
			Paperwork.send('inventory.add', {
				id: item.id,
				name: item.name,
				price: item.price,
			});
			
			Paperwork.send('notification', 'Saved');
			
		});
		
	}
	
	function add(data){
		if(!data.id){
			console.warn('ID not suppied');
			return;
		}
		
		if(!data.price) data.price = 0;
		
		inventory[data.id] = {
			display: true,
			name: data.name,
			price: data.price,
		};
		
		render();
	}
	
	function render(){
		$list.html('');
		
		for(let i in inventory){
			const value = inventory[i];
			
			if(!value.display) continue;
			
			value.price = Paperwork.dollar(value.price, {
				sign: false
			});
			
			$list.prepend(`
				<li data-id="${i}">
					<div class="item">
						<input type="text" name="name" value="${value.name}" placeholder="${value.name}">
						<input type="text" name="price" value="${value.price}" placeholder="${value.price}">
						<div data-type="remove" class="remove-btn"></div>
					</div>
				</li>
			`);
		}
	}
	
	function inlineUpdate(){
		$body.on('change', 'ul input', function(){
			
			var $item = $(this).closest('[data-id]');
			
			var id = $item[0].attributes['data-id'].value,
				name = $item.find('input[name="name"]').val(),
				price = $item.find('input[name="price"]').val();
			
			if(name.length && price.length && id.length){
				
				// Update inventory
				inventory[id].name = name;
				inventory[id].price = price;
				
				// Request
				$.post(request.put, {
					id: id,
					name: name,
					price: price,
				}).done(function(item){
					item = JSON.parse(item);
					
					inventory[item.id].name = item.name;
					inventory[item.id].price = item.price;
					
					render();
					Paperwork.send('notification', 'Saved');
				});
			}
		});
	}
	
	function remove(){
		var $item = $(this).closest('[data-id]'),
			id = $item[0].attributes['data-id'].value;
		
		$.post(request.delete, {
			id: $item[0].attributes['data-id'].value
		}).done(function(data){
			
			delete inventory[id];
			$item.remove();
			Paperwork.send('notification', 'Saved');
		});
	}
});