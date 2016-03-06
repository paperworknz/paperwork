var Painter = function(){
	var a= this;
	a.is= 'Zamorak';
};

Painter.prototype.flush = function(selected){
	selected.find('[form-inventory]').remove();
	selected.find('[data-item]').remove();
	selected.find('[form-itembuffer]').remove();
	selected.find('[form-itemlist]').css({
		'border-top': '1px solid black',
		'border-left': '1px solid black',
		'border-bottom': 'none',
	});
	selected.find('[form-itemlist]').after('<div style="position:relative" form-inventory><div form-typeahead><input class="typeahead tt" type="text" placeholder="Item"/></div></div>');
	selected.find('[form-itemlist]').next().after('<div form-content></div>');
	selected.append('<style>.qq-item {padding:0px 6px}.qq-qty, .qq-price, .qq-total {border:none;width: 70px;text-align: center;height:24px;line-height:24px;outline:0}.blob_item {border-right: 1px solid black;border-left: 1px solid black;line-height:24px;height:24px;}.blob_item, .blob_item div {page-break-inside:avoid!important;}@media print {.blob_item, .blob_item div {page-break-inside:avoid!important}}.qq-left {border-left: 1px solid black;}.ta {z-index:1;width:100%;border-top:1px solid #333;border-left:1px solid #333;border-right:1px solid #333;}.typeahead {border:1px solid white;width:100%;outline:0}</style>');
};

Painter.prototype.on = function(what, selected, method, callback){
	switch(what){
		case 'item':	what= '.qq-item'; break;
		case 'qty':		what= '.qq-qty'; break;
		case 'price':	what= '.qq-price'; break;
		case 'total':	what= '.qq-total'; break;
	}
	selected.on(method, what, function(event){
		callback({
			event: event,
			element: what,
		});
	});
};

Painter.prototype.each = function(what, selected, callback){
	if($('[form-content]').length === 0){
		switch(what){
			case 'item': what = '[form-itemname] [data-item]';
		}
		selected.find(what).each(function(){
			if(what == '[form-itemname] [data-item]'){
				var itemID = $(this).attr('data-item');
				var event = {
					itemID: itemID,
					item: selected.find('[form-itemname] [data-item="'+itemID+'"] .qq-item [contenteditable]').html(),
					quantity: selected.find('[form-itemqty] [data-item="'+itemID+'"] .qq-qty').next().html(),
					price: selected.find('[form-itemprice] [data-item="'+itemID+'"] .qq-price').next().html(),
					total: selected.find('[form-itemtotal] [data-item="'+itemID+'"] .qq-total').html()
				};
			}
			callback(event);
		});
	}else{
		switch(what){
			case 'item': what = '[form-content-item]';
		}
		selected.find(what).each(function(){
			if(what == '[form-content-item]'){
				var itemID = $(this).attr('data-item');
				var event = {
					itemID: itemID,
					item: selected.find('[data-item="'+itemID+'"] .qq-item [contenteditable]').html(),
					quantity: selected.find('[data-item="'+itemID+'"] .qq-qty').html(),
					price: selected.find('[data-item="'+itemID+'"] .qq-price').html(),
					total: selected.find('[data-item="'+itemID+'"] .qq-total').html()
				};
			}
			callback(event);
		});
	}
};

Painter.prototype.get = function(what, selected){
	switch(what){
		case 'item-quantity': return '.qq-qty'; break;
		case 'item-total': return '.qq-total'; break;
		case 'typeahead-parent': return '[form-inventory]'; break;
		case 'latest-item-id': return selected.find('[form-content-item]').last().attr('data-item'); break;
		case 'subtotal': return selected.find('[form-subtotal]').html(); break;
		case 'tax': return selected.find('[form-tax]').html(); break;
		case 'total': return selected.find('[form-total]').html(); break;
	}
};

Painter.prototype.set = function(what, selected, val){
	switch(what){
		case 'jobID': what = '[form-jobid]'; break;
		case 'date': what = '[form-date]'; break;
		case 'client': what = '[form-clientblob]'; break;
		case 'subtotal': what = '[form-subtotal]'; break;
		case 'tax': what = '[form-tax]'; break;
		case 'total': what = '[form-total]'; break;
	}
	
	selected.find(what).html(val);
};

Painter.prototype.do = function(what, selected, data){
	switch(what){
		case 'focus-last-item-quantity': selected.find('.qq-qty').last().focus(); break;
		case 'remove-typeahead': selected.find('[form-inventory]').html(''); break;
		case 'flush-items': selected.find('[form-content]').html(''); break;
		case 'price-by-ID': if(data != undefined) selected.find('[data-item="'+data.itemID+'"] .qq-price').html(data.val); break;
		case 'total-by-ID': if(data != undefined) selected.find('[data-item="'+data.itemID+'"] .qq-total').html(data.val); break;
	}
};

Painter.prototype.initialiseTypeahead = function(selected, callback){
	selected.find('[form-inventory]').html
		('<div form-typeahead><input class="typeahead tt" type="text" placeholder="Item"/></div>');
	callback();
};


Painter.prototype.append = function(selected, data){
	selected.find('[form-content]').append(
		'<div data-item="'+data.itemID+'" class="blob_item" form-content-item>'+
			'<div style="float:right;border-left: 1px solid black;"><div class="qq-total"></div></div>'+
			'<div style="float:right;border-left: 1px solid black;"><div style="position:relative"><div class="qq-price" contenteditable>'+data.price+'</div></div></div>'+
			'<div style="float:right;border-left: 1px solid black;"><div class="qq-qty" contenteditable>'+data.quantity+'</div></div>'+
			'<div style="width:auto;overflow:hidden"><div class="qq-item wrapper" style="position:relative"><div contenteditable style="outline:0">'+data.item+'</div><div class="twig-remove noselect">x</div></div></div></div>'+
		'</div>'
	);
};

Painter.prototype.update = function(form){
	/*
	Remove all borders and add border to bottom ele
	*/
	form.find('[form-content]').find('[data-item]').css({'border-bottom': 'none','border-top': 'none'});
	form.find('[data-item]').last().css('border-bottom', '1px solid black');
};

Painter.prototype.strip = function(form){
	form.find('[form-inventory]').html('');
	form.find('.twig-remove').each(function(){$(this).remove();});
	return form;
};