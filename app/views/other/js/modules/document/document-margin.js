Core.addModule('document-margin', function(context){
	
	var $body = context.element;
	var parse = context.require('parse');
	var items = context.data.documents.items || {};
	var selection = {};
	
	bind();
	render();
	
	// Populate selection object
	for(let i in items) selection[i] = false;
	
	function bind(){
		
		// Click to add item to selection
		$body.on('click', '.inventory-item', function(){
			var index = $(this).index();
			
			// Toggle selection
			selection[index] ? selection[index] = false : selection[index] = true;
			$(this).toggleClass('selected');
		});
		
		// Calculate and render on slider change
		$body.on('input', '[data-type="slider"], [data-type="margin-input"]', function(){
			var margin = $(this).val();
			
			$body.find('[data-type="margin-input"], [data-type="slider"]').val(margin);
			
			margin = parse.toNumber(margin);
			margin = parse.toNumber(((margin + 100) / 100), {
				decimal: 2,
			});
			
			calculate(margin);
			render();
		});
		
		// Apply button
		$body.on('click', '[data-type="apply-button"]', function(){
			
			Paperwork.send('document.build', {
				[context.data.document_id]: context.data.documents,
			});
			
			context.stop();
		});
		
		// Cancel button
		$body.on('click', '[data-type="cancel-button"]', context.stop);
	}
	
	function render(){
		
		// This method calculates and renders
		// The document object is not changed during this process
		
		var subtotal = 0;
		var tax = 0;
		var total = 0;
		
		$body.find('[data-type="margin-content"]').html('');
		
		for(let i in items){
			const value = items[i];
			
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
			
			// Calculating margin (for display)
			if(price) price = price * margin;
			
			total = quantity * price;
			total = parse.toNumber(total, {
				decimal: 2,
			});
			
			if(total) subtotal += Number(total);
			
			// Format numbers
			quantity = parse.toNumber(quantity, {
				decimal: 2,
				natural: true,
			});
			
			margin = (margin * 100) - 100;
			margin = parse.toNumber(margin, {
				decimal: 0,
				natural: true,
			});
			price = parse.toDollar(price);
			total = parse.toDollar(total);
			if(quantity === 0) quantity = '0.00';
			if(price === '$0') price = '$0.00';
			if(total === '$0') total = '$0.00';
			
			if(!quantity || !price) total = '';
			
			// Active class
			var selected = selection[i] ? 'selected' : '';
			
			$body.find('[data-type="margin-content"]').append(`
				<section class="inventory-item ${selected}">
					<part class="inventory-item_name">
						<part data-type="name">
							${value.name}
						</part>
						
					</part>
					<part class="inventory-item_qty">
						<part data-type="quantity">
							${quantity}
						</part>
					</part>
					<part class="inventory-item_price">
						<part data-type="price">
							${price}
						</part>
					</part>
					<part class="inventory-item_total">
						<part data-type="item-total">
							${total}
						</part
					</part>
				</section>
			`);
			
			if(margin > 0){
				$body.find('[data-type="margin-content"] [data-type="name"]').after(`
					<part class="inventory-item_margin">
						Margin: ${margin}%
					</part>
				`);
			}
		}
		
		// Calculate subtotal, tax, total
		subtotal = parse.toNumber(subtotal, {
			decimal: 2,
		});
		
		tax = parse.toDollar(((subtotal / 100) * 15));
		total = parse.toDollar(((subtotal / 100) * 15) + subtotal);
		
		// Render subtotal, tax, total
		$body.find('[data-type="subtotal"]').html(parse.toDollar(subtotal));
		$body.find('[data-type="tax"]').html(parse.toDollar(tax));
		$body.find('[data-type="total"]').html(parse.toDollar(total));
	}
	
	function calculate(margin){
		
		for(let i in items) {
			const value = items[i];
			
			if(selection[i]) {
				value.margin = margin;
			}
		}
	}
});