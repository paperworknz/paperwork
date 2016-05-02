Form.prototype.append = function(form, item, quantity, price){
	var a		= this,
		item	= item !== undefined ? item : '',
		quantity= quantity !== undefined ? quantity : '',
		price	= price !== undefined ? price : '',
		formID	= $(form).attr('data-formid'),
		itemID	= a.p.get('latest-item-id', form),
		flag	= false; // Flag changes if item is not in inv
	
	// Prep
	if(itemID === undefined) itemID = 0;
	itemID = Number(itemID) + 1;
	
	if(a.inv[item] && price === '') price = flag = a.inv[item]; // If item is in inventory get price
	if(!item) item = price = ''; // If item is not entered
	if(price == '0.00') price = ''; // If price is set, but is 0.00, std to empty
	
	// Append item to DOM
	a.p.append(form, {
		itemID: itemID,
		item: item,
		quantity: quantity,
		price: price
	});
	
	// Detect a new inventory item, depends on SweetAlert
	if(event.which == 13) event.preventDefault(); // Prevent enter auto submitting swal
	if(flag === false && item != undefined){
		swal({
			html: true,
			title: 'Add '+item+' to your inventory?',
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
			});
		});
	}
	console.log('kappa');
	// Housekeep
	$('.typeahead').typeahead('val', ''); // Clear typeahead input
	a.p.do('focus-last-item-quantity', form); // Focus on quantity input
	a.update(form);
};