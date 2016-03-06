Form.prototype.update = function(form){
	var a= this,
		formID= $(form).attr('data-formID'),
		i= 0.00;
	
	var std = function(x){return x.toFixed(2);};
	var comma = function(x){return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");};
	
	// Update each item
	a.p.each('item', form, function(event){
		var itemID= event.itemID,
			name= event.name,
			quantity= event.quantity.replace(',', ''),
			price= event.price.replace('$', '').replace(',', '');
		
		// Standardize data
		var nprice = std(Number(price)); // Standardize price to a number with two decimal places and commas
		
		// Total
		var total = std((Number(quantity) * nprice)); // Add up total
		i += Number(total);
		
		// Standardize data
		price = nprice > 0.00 ? nprice : price;
		
		// Update DOM
		a.p.do('price-by-ID', form, {itemID:itemID, val:'$'+comma(price)});
		a.p.do('total-by-ID', form, {itemID:itemID, val:'$'+comma(total)});
	});
	
	
	var subtotal = std(i),
		tax = std((((i * 3) / 2) / 10)),
		total = std((Number(subtotal)+Number(tax)));
	
	a.p.set('subtotal', form, '$'+comma(subtotal));
	a.p.set('tax', form, '$'+comma(tax));
	a.p.set('total', form, '$'+comma(total));
	
	// Update map
	a.crawl(form);
	
	// Painter layer
	if (a.p.update != undefined) a.p.update(form);
};