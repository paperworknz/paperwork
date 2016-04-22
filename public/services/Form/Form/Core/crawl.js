Form.prototype.crawl = function(form){
	/*
	Map a form
	*/
	
	var a=this,
		formID= form.attr('data-formid'),
		margin= {};
	
	// Cache margins for each item in margin object
	if(a.map[formID] != undefined){
		$.each(a.map[formID].items, function(a,b){
			if(b.margin !== undefined || b.margin == 0){
				margin[a] = b.margin;
			}else{
				margin[a] = "1";
			}
		});
	}
	
	// Reset map for this form
	a.map[formID] = {
		items: {},
		subtotal: 0,
		tax: 0,
		total: 0,
	};
	
	// Populate map
	a.p.each('item', form, function(event){
		if(a.map[formID].items[event.itemID] === undefined) a.map[formID].items[event.itemID] = {};
		a.map[formID].items[event.itemID].itemID = event.itemID;
		a.map[formID].items[event.itemID].item = event.item;
		a.map[formID].items[event.itemID].quantity = event.quantity;
		a.map[formID].items[event.itemID].price = event.price;
		a.map[formID].items[event.itemID].total = event.total;
		if(margin[event.itemID] != undefined) a.map[formID].items[event.itemID].margin = margin[event.itemID]; // Add margin back in
	});
	
	// Update subtotal, tax, total
	a.map[formID].subtotal = a.p.get('subtotal', form);
	a.map[formID].tax = a.p.get('tax', form);
	a.map[formID].total = a.p.get('total', form);
};