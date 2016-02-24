var Form = function(obj){
	var a = this;
	
	// Depends on
	a.typeahead	= obj.typeahead;
	a.tab		= obj.tab;
	
	// Properties
	a.s			= obj.scope ? obj.scope : '.'+a.tab.activeObj, // Class which contains active form
	a.inv		= obj.inv;
	a.invP		= obj.invPost;
	a.map		= []; // Array of objects: [{formID:420, inv:{...}, subtotal:100, tax:15, total:115}, {...}]
	
	// __construct()
	$('.'+a.tab.obj).each(function(){ // Iterate through each tab object
		a.refresh($(this).find('[form-blob]')); // Provision each form-blob
	});
};

// ################################ CORE ################################

// Set up a form for interactive use. Form should be [form-blob]
Form.prototype.refresh = function(form){
	var a = this;
	
	$('body').on('change', function(){a.update();}); // Update form on body change
	$('body').on('blur', '.qq-price', function(){
		var item = $(this).closest('[data-item]').attr('data-item'),
			name = $('[form-itemname]').find('[data-item="'+item+'"] [contenteditable]').html(),
			price = $(this).val().replace('$', '').replace(',', '');
		
		// Price auto update turned off while margins are being tested
		/*if(a.inv[name]){
			// Update price locally
			a.inv[name] = price;	
			// Update price on server
			$.post(a.invP, {
				type: 'Material',
				name: name,
				price: price
			});
		}*/
	});
	
	if(form.closest('.'+a.tab.obj).attr('data-formid') != undefined){
		
		// Update qty and price from hidden
		form.find('.qq-qty').each(function(){$(this).val($(this).next().html());});
		form.find('.qq-price').each(function(){$(this).val('$'+$(this).next().html().replace('$', ''));}); // Remove stray $ from hidden
		
		// Reset form-typeahead html
		form.find('[form-inventory]').html(
			'<div class="ta" form-typeahead><input class="typeahead tt" type="text" placeholder="Item"/></div>'
		);
		a.typeahead.run(form); // Depends on typeahead run() method
		
		// Strip listeners
		a.dark(form);
		
		// Bind typeahead to append() method
		form.bind('typeahead:select', '.typeahead', function(){
			if(event.which == 13){ // Ignore enter key
				return;
			}else{ // Run as intended
				a.append();
				return;
			}
		});
		
		// Add typeahead suggestion on enter key
		form.on('keydown', '.typeahead', function(){
			if(event.which == 13){
				a.append();
			}
		});
		
		// Remove item using .twig-remove button
		form.on('click', '.twig-remove', function(){
			var i = $(this).closest('li').attr('data-item');
			$(a.s).each(function(){
				$(this).find('li[data-item="'+i+'"]').remove();
			});
			a.update();
		});
		
		// Update form-pdf-formid to tabID
		var tabID = $('.'+a.tab.activeTab).attr(a.tab.tabhook);
		form.closest('.'+a.tab.obj).find('[form-pdf-formid]').val(tabID);
		
		// Update form-date
		//form.find('[form-date]').html($('meta[name=date]').attr('content'));
		
	}
};

// Remove interactive tools, return html. Form should be [form-blob]
Form.prototype.strip = function(form){
	var a = this,
		html = form.clone();
	
	html.find('[form-inventory]').html('');
	return html.html();
};

// Remove all abstract interaction from form. To reignite, call form.refresh(form). Form should be [form-blob]
Form.prototype.dark = function(form){
	form.off().unbind();
};

// Add item from typeahead into item list
Form.prototype.append = function(){
	var a		= this,
		item	= $(a.s).find('.tt-input').val(),
		price	= '',
		itemID	= $(a.s).find('[form-itemtotal] li').last().attr('data-item'),
		flag	= false; // Flag changes if item is not in inv
	
	// Prep
	if(itemID == undefined) itemID = 0;
	itemID = Number(itemID) + 1;
	
	if(a.inv[item]) price = flag = a.inv[item];	// If item is in inventory get price
	if(!item)			item = price = '';		// If item is not part of inventory standardize to empty
	if(price == '0.00') price = '';				// If price is set, but is 0.00, std to empty
	
	// Append item
	$(a.s).find('[form-itemname]').append('<li data-item="'+itemID+'"><div class="qq-item wrapper pr"><div contenteditable>'+item+'</div><div class="twig-remove noselect">x</div></div></li>');
	$(a.s).find('[form-itemqty]').append('<li data-item="'+itemID+'"><div><input class="qq-qty"><div hidden></div></div></li>');
	$(a.s).find('[form-itemprice]').append('<li data-item="'+itemID+'"><div style="position:relative"><input class="qq-price"><div hidden></div></div></li>');
	$(a.s).find('[form-itemtotal]').append('<li data-item="'+itemID+'"><div class="qq-total"></div></li>');
	$(a.s).find('[form-itemprice]').find('li[data-item="'+itemID+'"]').find('input').val(price);
	
	// Detect a new inventory item, depends on SweetAlert
	if(event.which == 13) event.preventDefault(); // Prevent lazy enter auto submitting swal
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
			$.post(a.invP, {
				name: item,
				type: 'Material',
				price: '0.00',
			});
		});
	}
	
	// Housekeep
	$('.typeahead').typeahead('val', '');	// Clear typeahead input
	$(a.s).find('.qq-qty').last().focus();	// Focus on qty input
	a.update();
};

// Update item list, calculating tax, subtotal etc
Form.prototype.update = function(){
	var a = this,
		formid = $(a.s).attr('data-formid'),
		i = 0.00;
	// Return the number fixed to two decimal places
	var std = function(x){
		return x.toFixed(2);
	};
	
	var comma = function(x){
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	};
	
	// Update each item total
	$(a.s + ' .qq-total').each(function(){
		var item = $(this).parent().attr('data-item'),
			name = $(a.s).find('[data-item="'+item+'"] .qq-item').find('[contenteditable]').html(),
			qty = $(a.s).find('[data-item="'+item+'"] .qq-qty').val().replace(',', ''),
			price = $(a.s).find('[data-item="'+item+'"] .qq-price').val().replace('$', '').replace(',', '');
		
		// Standardize data
		var nprice = std(Number(price)); // Standardize price to a number with two decimal places and commas
		
		// Total
		var total = std((Number(qty) * nprice)); // Add up total
		i += Number(total);
		
		// Standardize data
		price = nprice > 0.00 ? nprice : price;
		
		
		// Update DOM
		$(a.s).find('[data-item="'+item+'"] .qq-price').val('$'+comma(price)); // Input price
		$(a.s).find('[data-item="'+item+'"] .qq-price').next().html(comma(price)); // Hidden price
		$(a.s).find('[data-item="'+item+'"] .qq-qty').next().html(qty); // Hidden qty
		$(this).html('$'+comma(total));
		
		// Update a.map
		if(a.map[formid] == undefined) a.map[formid] = {
			formID: formid,
			inv: {},
		};
		if(a.map[formid].inv[item] == undefined) a.map[formid].inv[item] = {};
		a.map[formid].inv[item].ID = item;
		a.map[formid].inv[item].name = name;
		a.map[formid].inv[item].qty = qty;
		a.map[formid].inv[item].price = price;
		a.map[formid].inv[item].total = total;
	});
	
	var subtotal = std(i),
		tax = std((((i * 3) / 2) / 10)),
		total = std((Number(subtotal)+Number(tax)));
	$(a.s).find('[form-subtotal]').html('$'+comma(subtotal)); // Update sub-total
	$(a.s).find('[form-tax]').html('$'+comma(tax)); // Tax 15%
	$(a.s).find('[form-total]').html('$'+comma(total)); // Total
	
	// Update a.map
	a.map[formid].subtotal = subtotal;
	a.map[formid].tax = tax;
	a.map[formid].total = total;
};

// ################################ REST ################################

// Save form
Form.prototype.put = function(data, callback){
	var a = this,
		formID = data.formID != undefined ? data.formID : $(a.s).attr('data-formid'),
		blob = $('[data-formid="'+formID+'"] [form-blob]'),
		html = a.strip(blob); // Remove interactive tools, returns html
	
	// Put form
	if(data.url != undefined && formID != undefined){
		$.post(data.url, {
			formID: formID, // User defined or current
			blob: html
		}).done(function(data){
			
			if(data != '0'){
				a.refresh(blob); // Provision form again
				if(callback != undefined) callback(); // Callback
			}else{
				console.log('Form put failed');
			}
		});
	}
};

// Delete form
Form.prototype.delete = function(data, callback){
	var a = this;
	
	// Delete form
	if(data.url != undefined && data.formID != undefined){
		$.post(data.url, {
			formID: data.formID
		}).done(function(data){
			if(data != '0'){
				if(callback != undefined) callback(); // Callback
			}else{
				console.log('Form delete failed');
			}
		});
	}
};

// New form
Form.prototype.post = function(data, callback){
	var a = this;
	
	// Post form
	if(data.url != undefined && data.templateID != undefined &&
		data.clientID != undefined && data.jobID != undefined){
		$.post(data.url, {
			templateID:	data.templateID,
			clientID:	data.clientID,
			jobID:		data.jobID
		}).done(function(json){
			var json	= JSON.parse(json),
				obj		= a.tab.objParent,
				objID	= Number($(obj).find('['+a.tab.heir+']').attr(a.tab.objhook));
			
			// Create new obj
			$(obj).find('['+a.tab.heir+']').before('<div '+a.tab.objhook+'="'+objID+'" data-formid="'+json.formID+'" class="'+a.tab.obj+' h">'+json.blob+'</div>');
			$(obj).find('['+a.tab.heir+']').replaceWith('<div '+a.tab.objhook+'="'+(objID + 1)+'" '+a.tab.heir+' hidden></div>');
			
			// Create new tab
			a.tab.append(data.templateName, function(){
				// Populate empty form
				$(a.s).find('[form-jobID]').html(data.jobID);
				$(a.s).find('[form-date]').html(json.date);
				$(a.s).find('[form-clientblob]').html(json.client);
				// Instantiate typeahead
				if(a.typeahead != undefined) a.typeahead.run($(a.s).find('[form-blob]'));
				a.put({
					url: $(a.s).find('[form-save-btn]').attr('href')
				}, callback());
			});
		});
	}
};

// PDF
Form.prototype.pdf = function(form, callback){
	var a = this,
		blob = form.clone();
	
	// Replace input fields with text
	blob.find('[form-itemqty] li[data-item]').each(function(){
		$(this).find('.qq-qty').replaceWith('<div style="text-align:center;height:22px;line-height:22px">' + $(this).find('div[hidden]').html() + '</div>');
	});
	blob.find('[form-itemprice] li[data-item]').each(function(){
		$(this).find('.qq-price').replaceWith('<div style="text-align:center;height:22px;line-height:22px">$' + $(this).find('div[hidden]').html() + '</div>');
	});
	
	// Remove misc
	blob.find('[form-itembuffer]').each(function(){$(this).remove();});
	blob.find('[form-inventory]').html('');
	blob.find('.ihead').each(function(){$(this).css('border-bottom', '1px solid black');});
	blob.find('.twig-remove').each(function(){$(this).remove();});
	
	// Strip and get html
	blob = a.strip(blob);
	
	// Build html string for PDF
	var page = "<!DOCTYPE html>" + 
		"<html lang='en'>" +
		"<head>" + 
		"<meta name='viewport' content='width=device-width,initial-scale=1.0'>" + 
		"<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css' type='text/css'>" + 
		"</head>" + 
		"<body>" +
		blob + 
		"</body>";
	
	// Callback function
	callback(page);
};