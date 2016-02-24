var Form = function(obj){
	this.s				= obj.scope;
	this.name			= obj.meta.name;
	this.clientID		= obj.meta.clientID;
	this.jobID			= obj.meta.jobID;
	this.root			= obj.url.root;
	this.postURL		= obj.url.post;
	this.putURL			= obj.url.put;
	this.deleteURL		= obj.url.delete;
	this.invURL			= obj.url.inv;
	this.use			= {},
	this.itemID			= [],
	this.inv			= obj.inv,
	this.dollarsigns	= obj.dollar;
};

Form.prototype.set = function(use){
	var a = this;
	a.use = use;
};

Form.prototype.run = function(){
	var a = this;
	
	// Initialise typeahead for all forms
	if(a.use.typeahead != undefined){
		$(a.use.tab.obj).each(function(){
			var objID = $(this).attr('data-obj');
			if($(this).data('formid') != undefined){
				$(this).find('[form-inventory]').html('<div class="ta" form-typeahead><input class="typeahead tt" type="text" placeholder="Item"/></div>');
				a.use.typeahead.run($(this));
			}
			// Update qq-qty from hidden div
			$(this).find('.qq-qty').each(function(){
				var b = $(this).next().html();
				$(this).val(b);
			});
			
			// Update qq-price from hidden div
			$(this).find('.qq-price').each(function(){
				var b = $(this).next().html();
				$(this).val(b);
			});
			
			// ItemID
			var itemID = 0;
			$(this).find('[form-itemname] li').each(function(){
				if($(this).attr('data-item') != undefined){
					itemID = $(this).attr('data-item');
				}
			});
			a.itemID.push(Number(itemID));
			$(this).find('[form-pdf-formid]').val($(this).attr('data-obj'));
		});
	}
	
	// Add typeahead selected item, ignore enter key to avoid double submission
	$(a.use.tab.oP).bind('typeahead:select', '.tabopen .typeahead', function(){
		if(event.which == 13){ // Ignore enter key
			return;
		}else{ // Run as intended
			a.append();
			return;
		}
	});
	
	// Add typeahead suggestion on enter key
	$(a.use.tab.oP).on('keydown', '.tabopen .typeahead', function(){
		if(event.which == 13){
			a.append();
		}
	});
	
	// Remove item using .twig-remove button
	$(a.use.tab.oP).on('click', '.twig-remove', function(){
		var i = $(this).closest('li').data('item');
		$(a.s).each(function(){
			$(this).find("li[data-item='" + i + "']").remove();
		});
		a.update();
	});
	
	// Detect price change
	/*$('body').on('blur', '.qq-price', function(){
		var price = $(this).val();
		$(this).next().after("<div class=\"price-change box\" price=\""+price+"\"><a pc-yes style='cursor:pointer'>Update</a></div>");
	});
	/*$(document).on('click', '[pc-yes]', function(){
		var price = $(this).parent().attr('price');
		$.post(a.invURL, {
			 
		})
		$(this).parent().remove();
		
	});*/
	
	// Update quote whenever possible
	$('body').on('change', function(){
		a.update();
	});
};

Form.prototype.append = function(){
	var a		= this,
		item	= $(a.s).find('.tt-input').val(),
		objID	= $(a.s).attr('data-obj'),
		price	= '',
		flag	= false; // Flag if the entered item is not apart of inventory
	
	// Update itemID
	a.itemID[objID] += 1;
	var itemID = a.itemID[objID];
	
	// If the item is in inv get price
	$.each(a.inv, function(key, pair){
		if(item == key){
			price = pair;
			flag = true;
		}
	});
	
	// Prep
	if(!item)			item = price = '';
	if(price == '0.00') price = '';
	if(a.dollarsigns)	price = '$'+price;
	
	// Execute
	$(a.s).find('[form-itemname]').append("<li data-item='" + itemID + "'><div class='qq-item wrapper pr'><div contenteditable>" + item + "</div><div class='twig-remove noselect'>x</div></div></li>");
	$(a.s).find('[form-itemqty]').append("<li data-item='" + itemID + "'><div><input class='qq-qty'><div hidden></div></div></li>");
	$(a.s).find('[form-itemprice]').append("<li data-item='" + itemID + "'><div style='position:relative'><input class='qq-price'><div hidden></div></div></li>");
	$(a.s).find('[form-itemtotal]').append("<li data-item='" + itemID + "'><div class='qq-total'></div></li>");
	$(a.s).find('[form-itemprice]').find("li[data-item=" + itemID + "]").find("input").val(price);
	$(a.s).find('input.typeahead').typeahead('val', '');
	
	// House keep
	$('.typeahead').typeahead('val', '');
	
	// Prevent enter key
	if(event.which == '13'){
		event.preventDefault();
	}
	
	// Detect a new item
	if(flag == false){
		swal({
			html: true,
			title: 'Add '+item+' to your inventory?',
			text: 'If you save this item you can use it again in future.',
			showCancelButton: true,
			closeOnConfirm: true,
			cancelButtonText: 'No',
			confirmButtonText: 'Yes',
		}, function(data){
			if(data == true) a.addInventory({name: item});
		});
		
	}
	
	$(a.s).find('.qq-qty').last().focus();
	a.update();
};

Form.prototype.update = function(){
	var a = this;
	var deci = function(num){
		return num.toFixed(2);
	};
	
	
	$(a.s).find('.qq-qty').each(function(){
		var b = $(this).val(),
			c = 'li[data-item='+$(this).closest('li').data('item')+']',
			d = $(a.s).find('[form-itemprice]').find(c).find('input').val();
		if(!d || !b){
			$(a.s).find('[form-itemtotal]').find(c).find('.qq-total').html('');
		}else{
			$(a.s).find('[form-itemtotal]').find(c).find('.qq-total').html((a.dollarsigns ? '$' : '') + deci(b * d.replace('$', '')));
		}
		$(a.s).find('[form-itemqty]').find(c).find('div[hidden]').html(b);
	});
	
	$(a.s).find('.qq-price').each(function(){
		var b = ($(this).val()).replace('$', ''),
			c = 'li[data-item='+$(this).closest('li').data('item')+']',
			d = $(a.s).find('[form-itemqty]').find(c).find('input').val();
		if(!d || !b){
			$(a.s).find('[form-itemtotal]').find(c).find('.qq-total').html('');
		}else{
			$(a.s).find('[form-itemtotal]').find(c).find('.qq-total').html((a.dollarsigns ? '$' : '') + deci(b * d));
		}
		if(b != ''){
			$(this).val((a.dollarsigns ? '$' : '') + deci(Number(b)));
			$(a.s).find('[form-itemprice]').find(c).find('div[hidden]').html((a.dollarsigns ? '$' : '') + (deci(Number(b))));
		}
	});
	
	var i = 0;
	$(a.s).find('.qq-total').each(function(){ // Add all totals
		var b = Number($(this).html().replace('$', ''));
		if(!isNaN(b)) i += b;
	});
	
	i = i.toFixed(2); // Add decimal place for Sub Total and later GST
	j = (((i * 3) / 2) / 10).toFixed(2); // GST 15%
	$(a.s).find('[form-subtotal]').html((this.dollarsigns ? '$' : '') + i);
	$(a.s).find('[form-tax]').html((this.dollarsigns ? '$' : '') + j);
	total = (Number(j) + Number(i)).toFixed(2);
	$(a.s).find('[form-total]').html((this.dollarsigns ? '$' : '') + total);
};

Form.prototype.pdf = function(where, func){
	var a		= this,
		blob	= $(a.s).find(where).clone();
	
	// Remove jQuery bindings (re-binded once complete)
	$(a.use.tab.oP).unbind();
	$(a.use.tab.oP).off();
	
	// Update unit/qty input fields
	$(a.s).find('[form-itemqty] li[data-item]').each(function(){
		$(this).find('.qq-qty').replaceWith('<div style="text-align:center;height:22px;line-height:22px">' + $(this).find('div[hidden]').html() + '</div>');
	});
	$(a.s).find('[form-itemprice] li[data-item]').each(function(){
		$(this).find('.qq-price').replaceWith('<div style="text-align:center;height:22px;line-height:22px">' + $(this).find('div[hidden]').html() + '</div>');
	});
	
	// Remove misc
	$(a.s).find('[form-itembuffer]').each(function(){
		$(this).remove();
	});
	$(a.s).find('[form-inventory]').remove();
	$(a.s).find('.ihead').each(function(){
		$(this).css('border-bottom', '1px solid black');
	});
	$(a.s).find('.twig-remove').each(function(){
		$(this).remove();
	});
	
	// Build html string for PDF
	var page = "<!DOCTYPE html>" + 
		"<html lang='en'>" +
		"<head>" + 
		"<meta name='viewport' content='width=device-width,initial-scale=1.0'>" + 
		"<link rel='stylesheet' href='http://wolfe.nz/inc/bootstrap/bootstrap-3.3.2.css' type='text/css'>" + 
		"</head>" + 
		"<body>" +
		$(a.s).find(where).html() + 
		"</body>";
	
	// Callback function
	func(page, function(){
		$(a.s).find(where).replaceWith(blob);
		a.run();
	});
};

// ########################### REST

Form.prototype.addInventory = function(data){
	var a = this;
	
	// AJAX
	if(data.name != undefined){
		$.post(a.invURL, {
			name: data.name,
			type: 'Material',
			price: '0.00',
		});
	}else{
		console.log('inv name not provided');
	}
};

Form.prototype.post = function(data, finish){
	var a = this;
	
	// AJAX
	if(data.templateID != undefined && a.clientID != undefined && a.jobID != undefined){
		$.post(a.postURL, {
			templateID:	data.templateID,
			clientID:	a.clientID,
			jobID:		a.jobID
		}).done(function(data){
			if(data != '0'){
				var data	= JSON.parse(data),
					obj		= a.use.tab.oP,
					objID	= Number($(obj).find(a.use.tab.heir).data('obj'));
				
				// Create new obj
				$(obj).find(a.use.tab.heir).before('<div data-obj="'+objID+'" data-formid="'+data.formID+'" class="tabobj h">'+data.blob+'</div>');
				$(obj).find(a.use.tab.heir).replaceWith('<div data-obj="'+(objID + 1)+'" '+a.use.tab.heirRaw+' hidden></div>');
				
				// Create new tab
				a.use.tab.append(data.name, function(){
					// Populate empty form
					$(a.s).find('[form-jobID]').html(a.jobID);
					$(a.s).find('[form-date]').html(data.date);
					$(a.s).find('[form-clientblob]').html(data.client);
					// Instantiate typeahead
					if(a.use.typeahead != undefined) a.use.typeahead.run($(a.s));
					a.put({
						formID: data.formID
					}, finish());
				});
			}else{
				console.log('Ajax sent OK but returned failure');
			}
		});
	}else{
		console.log('Ajax not run, dump: \n data.templateID:'+data.templateID+'\n a.clientID:'+a.clientID+'\n a.jobID:'+a.jobID);
	}
};

Form.prototype.put = function(data, finish){
	var a		= this,
		blob	= $(a.s).find('[form-blob]').html(),
		formID	= data.formID;
	
	// AJAX
	if(blob != undefined && formID != undefined){
		$.post(a.putURL, {
			formID: formID,
			blob: blob
		}).done(function(data){
			if(data != '0'){
				if(finish != undefined) finish();
			}else{
				console.log('Ajax sent OK but returned failure');
			}
		});
	}else{
		console.log('Ajax not run, dump: \n formID:'+formID+'\n blob:'+blob);
	}
};

Form.prototype.delete = function(data){
	var a		= this,
		formID	= data.formID,
		tabID	= $('.active').data('tab'),
		objID	= $('[data-tab="'+tabID+'"]').prev().data('tab')
	
	// AJAX
	if(formID != undefined && tabID != undefined && objID != undefined){
		$.post(a.deleteURL, {
			formID: formID
		}).done(function(data){
			if(data != '0'){
				var noteposition = $('[note-parent]').position(),
					noteparent = $('[note-parent]').clone();
				
				$('[note-parent]').css({
					'position':'absolute',
					'top':noteposition.top,
					'left':noteposition.left
				});
				$(a.s).slideUp('fast', function(){
					$(a.s).remove();
					$('.tab.active').fadeOut('fast', function(){
						a.use.tab.activate($('[data-tab="'+tabID+'"]').prev());
						$('[note-parent]').replaceWith(noteparent);
						$('[note-wrapper]').on('click', function(){
							$('#notes').focus();
						});
						$(this).remove();
					});
				});
			}else{
				console.log('Ajax sent OK but returned failure');
			}
		});
	}else{
		console.log('Ajax not run, dump: \n tabID:'+tabID+'\n formID:'+formID+'\n objID:'+objID);
	}
};