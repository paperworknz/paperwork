Form.prototype.construct = function(form){
	/*
	This layer constructs the form from it's parts
	*/
	var a= this,
		formID= form.attr('data-formid');
	
	a.refresh(form); // Refresh listeners
	
	// Append map to DOM
	$.each(a.map[formID].items, function(key, val){
		a.p.append(form, {
			itemID: val.itemID,
			item: val.item,
			quantity: val.quantity,
			price: val.price
		});
	});
	
	a.update(form); // Update abstraction
	
	// Fade form in, allow mouse interaction
	form.css('pointer-events', 'auto');
	form.animate({
		opacity: 1
	}, 500);
};