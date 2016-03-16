var Form = function(){
	var a = this;
	
	// Depends on
	a.pw= pw;
	a.tab= tab;
	a.p= new Painter;
	
	// Properties
	a.s= '.'+a.tab.activeObj; // Div that contains the active form
	a.form= '[form-blob]'; // Div that contains a form blob
	a.map= {}; // Material on form
	
	// __construct()
	$.get(environment.root+'/get/inv', function(data){
		$.get(environment.root+'/get/form/'+environment.jobID, function(items){
			var src = [],
				map = JSON.parse(items);
			
			a.inv = JSON.parse(data); // Inventory
			$.each(a.inv, function(a,b){src.push(a)}); // Typeahead array of inventory
			a.typeahead= new Typeahead(src);
			
			$(a.form).each(function(){
				var form = $(this),
					formID= form.attr('data-formid');
				
				map[formID] != undefined || map[formID] != null ? a.map[formID] = map[formID] :	a.crawl(form);
				a.construct(form);
			});
		});
	});
};
Form.prototype.append = function(form, item, quantity, price){
	var a		= this,
		item	= item !== undefined ? item : '',
		quantity= quantity !== undefined ? quantity : '',
		price	= price !== undefined ? price : '',
		formID	= $(form).attr('data-formid'),
		itemID	= a.p.get('latest-item-id', form),
		flag	= quantity === undefined ? false : true; // Flag changes if item is not in inv
	
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
	
	// Housekeep
	$('.typeahead').typeahead('val', ''); // Clear typeahead input
	a.p.do('focus-last-item-quantity', form); // Focus on quantity input
	a.update(form);
};
Form.prototype.construct = function(form){
	/*
	This layer constructs the form from it's parts
	*/
	var a= this,
		formID= form.attr('data-formid');
	
	// Listeners
	a.dark(form); // Remove jQuery listeners
	$(a.tab.objParent).on('change', function(){ a.update(form) });
	a.p.on('qty', $(a.tab.objParent), 'input', function(){ a.update(form) });
	a.p.on('price', $(a.tab.objParent), 'blur', function(){ a.update(form) });
	a.p.on('price', $(a.tab.objParent), 'input', function(event){
		if(event.event.keyCode == 13){
			event.event.preventDefault();
			event.element.blur();
		}
	});
	form.on('click', '.twig-remove', function(){
		a.p.do('this-remove-item', $(this));
		a.update(form);
	});
	
	// Typeahead
	a.p.initialiseTypeahead(form, function(){ a.typeahead.run(form) });
	form.bind('typeahead:select', '.typeahead', function(){
		if(event.which == 13){ // Ignore enter key
			return;
		}else{ // Run as intended
			a.append(form, $(a.s).find('.tt-input').val());
			return;
		}
	});
	form.on('keydown', '.typeahead', function(){
		if(event.which == 13){
			a.append(form, $(a.s).find('.tt-input').val());
		}
	});
	
	// Update form-pdf-name
	var tabID = $('.'+a.tab.activeTab).attr(a.tab.tabhook),
		tname = $('.'+a.tab.activeTab).html();
	form.closest('.'+a.tab.obj).find('[form-pdf-name]').val(tabID+'-'+tname.toLowerCase());
	
	// Append map to DOM
	$.each(a.map[formID].items, function(key, val){
		a.p.append(form, {
			itemID: val.itemID,
			item: val.item,
			quantity: val.quantity,
			price: val.price
		});
	});
	a.update(form);
	
	// Fade form in, allow mouse interaction
	form.css('pointer-events', 'auto');
	form.animate({
		opacity: 1
	}, 500);
};
Form.prototype.crawl = function(form){
	/*
	Map a form
	*/
	
	var a=this,
		formID= form.attr('data-formid');
	
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
	});
	
	// Update subtotal, tax, total
	a.map[formID].subtotal = a.p.get('subtotal', form);
	a.map[formID].tax = a.p.get('tax', form);
	a.map[formID].total = a.p.get('total', form);
};
Form.prototype.dark = function(form){
	/*
	Remove all abstract interaction from form.
	To reignite, call form.refresh(form) - form should be a.form
	*/
	
	form.off().unbind();
};
Form.prototype.populate = function(form, data){
	var a= this;
	
	a.p.set('date', form, data.date);
	a.p.set('jobID', form, data.jobID);
	a.p.set('client', form, data.client);
};
Form.prototype.strip = function(form){
	/*
	Remove interactive tools, return html. Form should be a.form
	*/
	var a= this,
		html= form.clone();
	
	html = a.p.strip(html);
	
	return html.html();
};
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
Form.prototype.copy = function(form){
	var a= this,
		formID= form.attr('data-formid');
	
	swal({
		title: 'Choose your template',
		text: '1 for Quote, 2 for Invoice',
		type: 'input',
		inputPlaceholder: 'Write something',
		showCancelButton: true,
		html: true,
	}, function(e){
		if(e != false){ // User hasn't clicked cancel
			var button= $(this),
				input= e,
				templateName= 'Invoice';
			
			if(input == 1){
				templateName = 'Quote';
			}else if(input == 2){
				templateName = 'Invoice';
			}else{
				templateName = 'Invoice';
			}
			
			var data = {
				client: a.p.get('client', form),
				jobd: a.p.get('jobd', form),
				content: a.map[formID],
			};
			
			pw.wait(button);
			a.post({
				url: environment.root+'/post/form',
				templateID: input,
				templateName: templateName,
				clientID: environment.clientID,
				jobID: environment.jobID,
			}, function(newForm){
				
				// Append item to DOM
				$.each(a.map[formID].items, function(y,z){
					a.p.append(newForm, {
						itemID: z.itemID,
						item: z.item,
						quantity: z.quantity,
						price: z.price
					});
				});
				
				// Populate new form
				var newFormID = newForm.attr('data-formid');
				a.p.set('client', newForm, data.client);
				a.p.set('jobd', newForm, data.jobd);
				a.construct(newForm);
				a.put({
					url: environment.root+'/put/form',
					formID: newFormID,
				}, function(){
					pw.ready(button, 'COPY');
				});
			});
		}
	});
};
Form.prototype.margin = function(form){
	
	/*
	Listen. We have a.map so we don't need to dice around with DOM cloning to get this done.
	This can easily break depending on the form provided.
	We should build a generic element from a.map instead of cloning.
	*/
	
	var a= this,
		formID= form.attr('data-formid'),
		map = [];
	
	a.dark(form); // Turn off interaction
	
	var concern = form.find($(a.p.get('form-content', form))),
		button = $(this).closest($('.box'));
	
	var ely = {
		html: {
			clone:		concern.clone(),
			position:	concern.offset(),
			width:		concern.outerWidth()
		},
		margin: {
			clone:		button.clone(),
			position:	button.offset(),
			width:		button.outerWidth(),
		}
	};
	
	// Darken page, then show the concern
	$('#content').after('<div margin></div>'); // Append margin container
	$('[margin]').append('<div fade style="width:10000px;height:10000px;background-color:black;opacity:0.0;position:fixed;top:0;z-index:2;overflow:hidden;" disable></div>')
		.append(ely.html.clone.css({
			'z-index':999,
			'position':'absolute',
			'top':ely.html.position.top,
			'left':ely.html.position.left,
			'width':ely.html.width,
			'margin-top':0,
			'background-color':'white',
			'box-shadow':'0 0 20px rgba(0,0,0,.33)',
			'opacity':0.0
		}));
	
	// Fade in
	$('[fade]').animate({'opacity':0.5}, 150, function(){
		$('[margin] [form-content]').animate({'opacity':1}, 100);
	});
	
	// Append slider
	$('[margin] [form-content]').append(
		'<div class="ac" style="padding:10px 10px 0px 10px;">'+
			'<input cent style="width:60px;text-align:center" /> %'+
		'</div>'+
		'<div style="width:100%;padding:10px;">'+
			'<input range type="range" style="width:200px;margin:0 auto">'+
		'</div>'+
		'<div class="wrapper" style="padding:10px">'+
		'<button margin-apply class="wolfe-btn pull-right">APPLY</button>'+
		'<button margin-cancel class="wolfe-btn blue pull-right" style="margin-right:5px">CANCEL</button>'+
		'</div>');
	
	// Set input to 0
	$('[margin] [form-content] input').val(0);
	
	// ********* FORMDOM ********* //
	
	var remDOM = a.p.get('remove'),
		current = [],
		priceDOM = a.p.get('item-price');
		
	var std = function(x){return x.toFixed(2);};
	var comma = function(x){return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");};
	
	// Remove contenteditable, replace delete with checkbox
	$('[margin] '+remDOM).each(function(){
		var itemID = a.p.get('this-item-id', $(this));
		$(this).prev().removeAttr('contenteditable'); // This is formDOM manipulation, BUT formDOM that is appended.. Marginal..
		$(this).replaceWith('<input type="checkbox" class="twig-remove" style="width:15px;height:15px;margin-right:15px" data-item="'+itemID+'">');
	});
	
	// List of current prices on form
	$('[margin] '+priceDOM).each(function(){
		var itemID = a.p.get('this-item-id', $(this));
		current[itemID] = $(this).html();
	});
	
	// Update [cent] from slider
	$('[margin] [range]').on('input', function(){
		
		$('[cent]').val($(this).val()); // Update input to value of slider
		var cent = (Number($('[cent]').val()) + 100) / 100; // Get std cent value - must come after val is set
		
		// Put data-item into map if checkbox is checked
		$('[margin] input[type=checkbox]').each(function(){
			if($(this)[0].checked) map.push($(this).attr('data-item'));
		});
		
		// Update price in real time
		$('[margin] '+priceDOM).each(function(){
			var itemID = a.p.get('this-item-id', $(this));
			if(map.includes(itemID)){
				var price = Number(current[itemID].replace('$', '').replace(',', ''));
				$(this).html('$'+comma(std(price * cent)));
			}
		});
	});
	
	// Listen to convert
	$('[margin] [margin-apply]').on('click', function(){
		// Update a.map with new values then update();
		form.find(priceDOM).each(function(){
			var itemID = a.p.get('this-item-id', $(this));
			$(this).html($('[margin] [data-item="'+itemID+'"] '+priceDOM).html());
		});
		a.update(form);
		
		$('[margin] [form-content]').fadeOut(100, function(){
			$('[fade]').fadeOut(150, function(){
				$('[margin]').off().unbind().remove();
			});
		});
	});
	
	// ********* ******** ********* //
	
	// Listen to cancel
	$('[margin] [margin-cancel]').on('click', function(){
		a.update(form);
		$('[margin] [form-content]').fadeOut(100, function(){
			$('[fade]').fadeOut(150, function(){
				$('[margin]').off().unbind().remove();
				a.update(form);
			});
		});
	});
};
Form.prototype.pdf = function(form, callback){
	var a= this,
		html= form.clone();
	
	// Strip and get html
	html = a.strip(html);
	
	// Build html string for PDF
	var page = "<!DOCTYPE html>" + 
		"<html lang='en'>" +
		"<head>" + 
		"<meta name='viewport' content='width=device-width,initial-scale=1.0'>" + 
		"<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css' type='text/css'>" + 
		"</head>" + 
		"<body>" +
		html + 
		"</body>";
	
	// Callback function
	callback(page);
};
Form.prototype.delete = function(data, callback){
	var a = this;
	
	// Delete form
	if(data.url != undefined && data.formID != undefined){
		$.post(data.url, {
			formID: data.formID
		}).done(function(data){
			if(data != '0'){
				if(callback != undefined) callback(true); // Callback
			}else{
				if(callback != undefined) callback(false); // Callback
				console.log('Form delete failed with Slim 0');
			}
		}).fail(function(){
			if(callback != undefined) callback(false); // Callback
			console.log('Internal Server Error');
		});
	}
};
Form.prototype.post = function(data, callback){
	var a= this;
	
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
			$(obj).find('['+a.tab.heir+']').before('<div '+a.tab.objhook+'="'+objID+'" class="'+a.tab.obj+' h">'+json.html+'</div>');
			$(obj).find('['+a.tab.heir+']').replaceWith('<div '+a.tab.objhook+'="'+(objID + 1)+'" '+a.tab.heir+' hidden></div>');
			
			// Update data-formid on form-blob
			$('['+a.tab.objhook+'="'+objID+'"]').find('[form-blob]').attr('data-formid', json.formID);
			
			// Update a.map
			var form = $('[data-formid="'+json.formID+'"]');
			a.crawl(form);
			
			// Create new tab
			a.tab.append(data.templateName, function(){
				a.populate(form, {
					jobID: data.jobID,
					date: json.date,
					client: json.client,
				});
				a.put({
					url: environment.root+'/put/form',
					formID: json.formID,
				}, function(){
					a.construct(form);
					callback(form);
				});
			});
		}).fail(function(){
			if(callback != undefined) callback(false); // Callback
			console.log('Internal Server Error');
		});
	}
};
Form.prototype.put = function(data, callback){
	var a= this,
		formID= data.formID,
		form= $('[data-formid="'+formID+'"]'),
		save= form.clone();
	
	// Flush html items
	a.p.do('flush-items', save);
	var html= a.strip(save); // Remove interactive tools, returns html
	
	// Put form
	if(data.url != undefined && formID != undefined){
		$.post(data.url, {
			formID: formID, // User defined or current
			html: html,
			json: JSON.stringify(a.map[formID]),
		}).done(function(data){
			if(data != '0'){
				//a.refresh(form);
				//document.cookie = 'autosave.'+$(a.s).attr('data-formid')+'=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
				if(callback != undefined) callback(true); // Callback
			}else{
				if(callback != undefined) callback(false); // Callback
				console.log('Form put failed with Slim 0');
			}
		}).fail(function(){
			if(callback != undefined) callback(false); // Callback
			console.log('Internal Server Error');
		});
	}else{
		console.log('URL or formID not supplied, form not saved.');
	}
};