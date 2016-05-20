Form.prototype.crawl = function(form){
	/*
	Map a form
	*/
	
	var a=this,
		form_id= form.attr('data-formid'),
		margin= {};
	
	// Cache margins for each item in margin object
	if(a.map[form_id] != undefined){
		$.each(a.map[form_id].items, function(a,b){
			if(b.margin !== undefined || b.margin == 0){
				margin[a] = b.margin;
			}else{
				margin[a] = "1";
			}
		});
	}
	
	// Reset map for this form
	a.map[form_id] = {
		items: {},
		subtotal: 0,
		tax: 0,
		total: 0,
	};
	
	// Populate map
	a.p.each('item', form, function(event){
		if(a.map[form_id].items[event.itemID] === undefined) a.map[form_id].items[event.itemID] = {};
		a.map[form_id].items[event.itemID].itemID = event.itemID;
		a.map[form_id].items[event.itemID].item = event.item;
		a.map[form_id].items[event.itemID].quantity = event.quantity;
		a.map[form_id].items[event.itemID].price = event.price;
		a.map[form_id].items[event.itemID].total = event.total;
		if(margin[event.itemID] != undefined) a.map[form_id].items[event.itemID].margin = margin[event.itemID]; // Add margin back in
	});
	
	// Update subtotal, tax, total
	a.map[form_id].subtotal = a.p.get('subtotal', form);
	a.map[form_id].tax = a.p.get('tax', form);
	a.map[form_id].total = a.p.get('total', form);
};