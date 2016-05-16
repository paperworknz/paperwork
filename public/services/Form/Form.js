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
		$.get(environment.root+'/get/form/'+environment.job_id, function(items){
			var src = [],
				map = JSON.parse(items);
			
			// Add margin property to each item in json
			$.each(map, function(a, b){
				$.each(b.items, function(c,d){
					if(d.margin == undefined || d.margin == 0){
						map[a].items[c].margin = '1';
					}
				});
			});
			
			a.inv = JSON.parse(data); // Inventory
			$.each(a.inv, function(a,b){src.push(a)}); // Typeahead array of inventory
			a.typeahead= new Typeahead(src);
			
			$(a.form).each(function(){
				var form = $(this),
					form_id= form.attr('data-formid');
				
				map[form_id] != undefined || map[form_id] != null ? a.map[form_id] = map[form_id] :	a.crawl(form);
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
		form_id= form.attr('data-formid');
	
	a.refresh(form); // Refresh listeners
	
	// Append map to DOM
	$.each(a.map[form_id].items, function(key, val){
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
	a.p.set('jobID', form, data.job_number);
	a.p.set('client', form, data.client);
};
Form.prototype.refresh = function(form){
	var a= this;
	
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
		form_id= $(form).attr('data-formid'),
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
		price = nprice > 0.00 ? nprice : price;//
		
		// Update DOM
		a.p.do('price-by-ID', form, {itemID:itemID, val:'$'+comma(price)});
		a.p.do('total-by-ID', form, {itemID:itemID, val:'$'+comma(total)});
		
		// 
		if(a.map[form_id].items[itemID] != undefined){
			if(price != a.map[form_id].items[itemID].price.replace('$', '').replace(',', '') && $('[margin]').length == 0){
				a.map[form_id].items[itemID].margin = 1;
			}
		}
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
Form.prototype.copy = function(form, templates){
	var a= this,
		form_id= form.attr('data-formid'),
		formcontent = form.find($(a.p.get('form-content', form)));
	
	// Darken page, then show the concern
	a.dark(form); // Turn off interaction 
	
	$('#content').after('<div copy></div>'); // Append copy container
	$('[copy]').append('<div fade style="width:10000px;height:10000px;background-color:black;opacity:0.0;position:fixed;top:0;z-index:2;overflow:hidden;" disable></div>');
	$('[fade]').after('<div copy-content></div>');
	$('[copy-content]').css({
		position:'absolute',
		'z-index':999,
		top:formcontent.offset().top -51,
		left:formcontent.offset().left - 30,
		width:'710px',
		'background-color':'white',
		border:'none',
		'min-height':'50px',
		opacity: '0.00'
	});
	$('[copy-content]').html(
		'<div copy-parent class="wrapper">'+
			'<div style="text-align:center;font-size:20px;line-height:20px;padding:15px 0px">Use template:</div>'+
		'</div>'
	);
	$('[copy-parent]').css({
		margin:'10px'
	});
	
	$.each(templates, function(a,b){
		$('[copy-parent]').append(
			'<div class="new-template" data-templateid="'+a+'">'+
				b+
			'</div>'
		);
	});
	
	$('[copy-parent]').append('<button copy-cancel class="wolfe-btn blue pull-right" style="margin-right:5px">CANCEL</button>');
	
	// Fade in 
	$('[fade]').animate({'opacity':0.5}, 150, function(){
		$('[copy] [copy-content]').animate({'opacity':1}, 100);
	});
	
	// ********* FORMDOM ********* //
	
	// Listen to template selection
	$('[copy] .new-template').on('click', function(){
		var data = {
			client: a.p.get('client', form),
			jobd: a.p.get('jobd', form),
			content: a.map[form_id],
		};
		var template_name = $(this).html(),
			template_id = $(this).attr('data-templateid');
		
		$('[fade]').fadeOut(150, function(){
			$('[copy]').off().unbind().remove();
			a.refresh(form);
			a.update(form);
		});
		
		a.post({
			url: environment.root+'/post/form',
			template_name: template_name,
			template_id: template_id,
			client_id: environment.client_id,
			job_id: environment.job_id,
			job_number: environment.job_number,
		}, function(new_form){
			
			// Append item to DOM
			$.each(a.map[form_id].items, function(y,z){
				a.p.append(new_form, {
					itemID: z.itemID,
					item: z.item,
					quantity: z.quantity,
					price: z.price
				});
			});
			
			// Populate new form
			var new_form_id = new_form.attr('data-formid');
			a.p.set('client', new_form, data.client);
			a.p.set('jobd', new_form, data.jobd);
			a.construct(new_form);
			a.put({
				url: environment.root+'/put/form',
				id: new_form_id,
			});
		});
	});
	
	// Listen to cancel
	$('[copy] [copy-cancel]').on('click', function(){
		a.update(form);
		$('[copy] [copy-content]').fadeOut(100, function(){
			$('[fade]').fadeOut(150, function(){
				$('[copy]').off().unbind().remove();
				a.refresh(form);
				a.update(form);
			});
		});
	});
	
	// Cancel on click out of focus
	$('[fade]').on('click', function(){
		a.update(form);
		$('[copy] [copy-content]').fadeOut(100, function(){
			$('[fade]').fadeOut(150, function(){
				$('[copy]').off().unbind().remove();
				a.refresh(form);
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
Form.prototype.margin = function(form){
	
	var a= this,
		formID= form.attr('data-formid'),
		remDOM = a.p.get('remove'),
		pricemap = {},
		priceDOM = a.p.get('item-price'),
		formcontent = form.find($(a.p.get('form-content', form)));
		
	var std = function(x){return x.toFixed(2);};
	var comma = function(x){return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");};
	
	// List of current prices on form, and the original price via math
	$.each(a.map[formID].items, function(a,b){
		var itemID = a,
			margin = b.margin;
		
		pricemap[itemID] = { 
			'current': b.price,
			'original': Number(b.price.replace('$', '').replace(',', '')) / margin,
		};
	});
	
	// Darken page, then show the concern
	a.dark(form); // Turn off interaction
	
	$('#content').after('<div margin></div>'); // Append margin container
	$('[margin]').append('<div fade style="width:10000px;height:10000px;background-color:black;opacity:0.0;position:fixed;top:0;z-index:2;overflow:hidden;" disable></div>');
	$('[fade]').after('<div margin-content></div>');
	$('[margin-content]').css({
		position:'absolute',
		'z-index':999,
		top:formcontent.offset().top - 51,
		left:formcontent.offset().left - 30,
		width:'710px',
		'background-color':'white',
		border:'none',
		'min-height':'50px',
		opacity: '0.00'
	});
	$('[margin-content]').html('<div margin-parent></div>');
	$('[margin-parent]').css({
		margin:'10px',
		'border': '1px solid black'
	});
	
	// Append items 
	$.each(a.map[formID].items, function(a,b){
		$('[margin-parent]').append(
			'<div class="margin-item wrapper lowlight" item-id="'+a+'">'+
				'<input type="checkbox" style="float:left;margin-left:5px">'+
				'<div style="float:left;width:285px;overflow:hidden;white-space:nowrap;position:relative;margin-left:5px;margin-right:10px;height:24px;line-height:24px">'+b.item+'</div>'+
				'<div margin-qty style="float:left;width:50px;border-left:1px solid black;padding:0px 5px;text-align:center;height:24px;line-height:24px">'+b.quantity+'</div>'+
				'<div style="float:left;border-left:1px solid black;padding:0px 5px;width:230px;text-align:center;height:24px;line-height:24px;">'+
					'$'+comma(std(pricemap[a].original)) + ' > <span margin-price style="font-weight:600">'+b.price+'</span><span margin-percent> (+'+((b.margin * 100) - 100).toFixed(1)+'%)</span>'+
				'</div>'+
				'<div margin-total style="float:left;border-left:1px solid black;width:75px;text-align:center;height:24px;line-height:24px">'+b.total+'</div>'+
			'</div>'
		);
	});
	
	// Append slider
	$('[margin] [margin-content]').append(
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
	$('[margin] [cent], [margin] [range]').val(0);
	
	// Fade in 
	$('[fade]').animate({'opacity':0.5}, 150, function(){
		$('[margin] [margin-content]').animate({'opacity':1}, 100);
	});
	
	// ********* FORMDOM ********* //
	
	// Update [cent] from slider
	$('[margin] [range], [margin] [cent]').on('input', function(){
		
		$('[margin] [cent]').val($(this).val()); // Update input to value of slider
		$('[margin] [range]').val($(this).val());
		var cent = (Number($('[cent]').val()) + 100) / 100; // Get std cent value - must come after val is set
		
		// Update price and pricemap in real time 
		$('[margin] [item-id]').each(function(){
			var itemID = $(this).attr('item-id');
			if($(this).find('input[type=checkbox]')[0].checked){
				var price = pricemap[itemID].original,
					qty = $(this).find('[margin-qty]').html().replace('$', '').replace(',', '');
				
				$(this).find('[margin-price]').html('$'+comma(std(price * cent)));
				$(this).find('[margin-percent]').html(' (+'+Number(((cent*100)-100)).toFixed(1)+'%)');
				$(this).find('[margin-total]').html('$'+comma(std((price * cent) * qty)));
				
				// Update a.map margin property 
				a.map[formID].items[itemID].margin = cent;
			}
		});
	});
	
	// Highlight item if checked
	$('input:checkbox').on('change', function(){
		var item = $(this).closest('[item-id]');
		
		if(item.hasClass('lowlight')){
			item.removeClass('lowlight');
		}else{
			item.addClass('lowlight');
		}
	});
	
	// ********* ******** ********* //
	
	// Listen to convert
	$('[margin] [margin-apply]').on('click', function(){
		// Update a.map with new values then update();
		form.find(priceDOM).each(function(){
			var itemID = a.p.get('this-item-id', $(this));
			$(this).html($('[margin] [item-id="'+itemID+'"] span').html());
		});
		a.refresh(form);
		a.update(form);
		
		$('[margin] [margin-content]').fadeOut(100, function(){
			$('[fade]').fadeOut(150, function(){
				$('[margin]').off().unbind().remove();
			});
		});
	});
	
	// Listen to cancel
	$('[margin] [margin-cancel]').on('click', function(){
		a.update(form);
		$('[margin] [margin-content]').fadeOut(100, function(){
			$('[fade]').fadeOut(150, function(){
				$('[margin]').off().unbind().remove();
				a.refresh(form);
				a.update(form);
			});
		});
	});
	
	// Cancel on click out of focus
	$('[fade]').on('click', function(){
		a.update(form);
		$('[margin] [margin-content]').fadeOut(100, function(){
			$('[fade]').fadeOut(150, function(){
				$('[margin]').off().unbind().remove();
				a.refresh(form);
				a.update(form);
			});
		});
	});
	
};
Form.prototype.marginOLD = function(form){
	
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
	$('[margin] [cent], [margin] [range]').val(0);
	
	// ********* FORMDOM ********* //
	
	var remDOM = a.p.get('remove'),
		pricemap = {},
		priceDOM = a.p.get('item-price');
		
	var std = function(x){return x.toFixed(2);};
	var comma = function(x){return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");};
	
	// Remove contenteditable, replace delete with checkbox
	$('[margin] '+remDOM).each(function(){
		var itemID = a.p.get('this-item-id', $(this));
		$(this).prev().removeAttr('contenteditable'); // This is formDOM manipulation, BUT formDOM that is appended
		$(this).replaceWith('<input type="checkbox" class="twig-remove" style="width:15px;height:15px;margin-right:15px" data-item="'+itemID+'">');
	});
	
	// List of current prices on form, and the original price via math
	$('[margin] '+priceDOM).each(function(){
		var itemID = a.p.get('this-item-id', $(this)),
			margin = a.map[formID].items[itemID].margin;
		
		pricemap[itemID] = { 
			'current': $(this).html(),
			'original': Number($(this).html().replace('$', '').replace(',', '')) / margin,
		};
	});
	
	// Update [cent] from slider
	$('[margin] [range], [margin] [cent]').on('input', function(){
		
		$('[margin] [cent]').val($(this).val()); // Update input to value of slider
		$('[margin] [range]').val($(this).val());
		var cent = (Number($('[cent]').val()) + 100) / 100; // Get std cent value - must come after val is set
		
		// Put data-item into map if checkbox is checked
		$('[margin] input[type=checkbox]').each(function(){
			if($(this)[0].checked) map.push($(this).attr('data-item'));
		});
		
		// Update price and pricemap in real time 
		$('[margin] '+priceDOM).each(function(){
			var itemID = a.p.get('this-item-id', $(this));
			if(map.includes(itemID)){
				var price = pricemap[itemID].original;
				$(this).html('$'+comma(std(price * cent)));
				
				// Update a.map margin property 
				a.map[formID].items[itemID].margin = cent;
			}
		});
	});
	
	// ********* ******** ********* //
	
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
	
	// Cancel on click out of focus
	$('[fade]').on('click', function(){
		a.update(form);
		$('[margin] [form-content]').fadeOut(100, function(){
			$('[fade]').fadeOut(150, function(){
				$('[margin]').off().unbind().remove();
				a.update(form);
			});
		});
	});
};
Form.prototype.delete = function(data, callback){
	var a = this;
	
	// Delete form
	if(data.url != undefined && data.form_id != undefined){
		$.post(data.url, {
			id: data.form_id
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
	if(data.url != undefined && data.template_id != undefined &&
		data.client_id != undefined && data.job_id != undefined && data.job_number != undefined){
		$.post(data.url, {
			template_id: data.template_id,
			client_id: data.client_id,
			job_id: data.job_id
		}).done(function(json){
			var json	= JSON.parse(json),
				obj		= a.tab.objParent,
				objID	= Number($(obj).find('['+a.tab.heir+']').attr(a.tab.objhook)),
				form_id	= json.id;
			
			// Create new obj
			$(obj).find('['+a.tab.heir+']').before('<div '+a.tab.objhook+'="'+objID+'" class="'+a.tab.obj+' h">'+json.html+'</div>');
			$(obj).find('['+a.tab.heir+']').replaceWith('<div '+a.tab.objhook+'="'+(objID + 1)+'" '+a.tab.heir+' hidden></div>');
			
			// Update data-formid on form-blob
			$('['+a.tab.objhook+'="'+objID+'"]').find('[form-blob]').attr('data-formid', form_id);
			
			// Update a.map
			var form = $('[data-formid="'+form_id+'"]');
			a.crawl(form);
			
			// Create new tab
			a.tab.append(data.template_name, function(tabID){
				a.populate(form, {
					job_number: data.job_number,
					date: json.date,
					client: json.client,
				});
				a.put({
					url: environment.root+'/put/form',
					id: form_id,
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
		form= $('[data-formid="'+data.id+'"]'),
		save= form.clone();
	
	// Flush html items
	a.p.do('flush-items', save);
	var html= a.strip(save); // Remove interactive tools, returns html
	
	// Put form
	if(data.url != undefined && data.id != undefined){
		$.post(data.url, {
			id: data.id, // User defined or current
			html: html,
			json: JSON.stringify(a.map[data.id]),
		}).done(function(){
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
		console.log('URL or data.id not supplied, form not saved.');
	}
};