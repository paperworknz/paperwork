Form.prototype.append = function(form, item, quantity, price){
	var a		= this,
		item	= item !== undefined ? item : '',
		quantity= quantity !== undefined ? quantity : '',
		price	= price !== undefined ? price : '',
		form_id	= $(form).attr('data-formid'),
		item_id	= a.p.get('latest-item-id', form),
		flag	= false; // Flag changes if item is not in inv
	
	// Prep
	if(item_id === undefined) item_id = 0;
	item_id = Number(item_id) + 1;
	
	if(a.inv[item] && price === '') price = flag = a.inv[item]; // If item is in inventory get price
	if(!item) item = price = ''; // If item is not entered
	if(price == '0.00') price = ''; // If price is set, but is 0.00, std to empty
	
	// Append item to DOM
	a.p.append(form, {
		itemID: item_id,
		item: item,
		quantity: quantity,
		price: price
	});
	
	// Detect a new inventory item, depends on SweetAlert
	if(event.which == 13) event.preventDefault(); // Prevent enter auto submitting swal
	if(flag === false && item != undefined){
		swal({
			html: true,
			title: `Add ${item} to your inventory?`,
			text: 'If you save this item you can use it again in future.',
			showCancelButton: true,
			closeOnConfirm: true,
			cancelButtonText: 'No',
			confirmButtonText: 'Yes',
		}, function(){ // Add inventory
			// Add item to server
			$.post(environment.root+'/post/inv', {
				name: item,
				price: '0.00',
			}).done(function(data){
				data = JSON.parse(data);
				a.inv[data.name] = data.price;
				var src = [];
				$.each(a.inv, function(a,b){src.push(a)}); // Typeahead array of inventory
				a.typeahead= new Typeahead(src);
				a.p.initialiseTypeahead(form, function(){ a.typeahead.run(form) });
			});
		});
	}
	
	// Housekeep
	$('.typeahead').typeahead('val', ''); // Clear typeahead input
	a.p.do('focus-last-item-quantity', form); // Focus on quantity input
	a.update(form);
};