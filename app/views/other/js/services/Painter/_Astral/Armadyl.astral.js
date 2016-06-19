var Painter = function(){
	var a= this;
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
};

Painter.prototype.get = function(what, selected){
	switch(what){
		case 'item-quantity': return '.qq-qty'; break;
		case 'item-total': return '.qq-total'; break;
		case 'item-price': return '.qq-price'; break;
		case 'form-content': return '[form-content]'; break;
		case 'typeahead-parent': return '[form-inventory]'; break;
		case 'remove': return '.twig-remove'; break;
		case 'latest-item-id': return selected.find('[form-content-item]').last().attr('data-item'); break;
		case 'subtotal': return selected.find('[form-subtotal]').html(); break;
		case 'tax': return selected.find('[form-tax]').html(); break;
		case 'total': return selected.find('[form-total]').html(); break;
		case 'client': return selected.find('[form-clientblob]').html(); break;
		case 'jobd': return selected.find('[form-jobd]').html(); break;
		case 'this-item-id': return selected.closest('[data-item]').attr('data-item'); break;
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
		case 'form-content': what = '[form-content]'; break;
		case 'jobd': what = '[form-jobd]'; break;
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
		case 'this-remove-item': selected.closest('[data-item]').remove(); break;
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
			'<div style="width: 435px;position: relative;"><div class="qq-item wrapper" style="position:relative"><div contenteditable style="outline:0">'+data.item+'</div><div class="twig-remove noselect">x</div></div></div></div>'+
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