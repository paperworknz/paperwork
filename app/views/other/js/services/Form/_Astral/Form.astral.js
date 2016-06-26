var Form = function(){
	var a = this;
	
	// Depends on
	a.pw= Paperwork;
	a.tab= tab;
	a.p= new Painter;
	
	// Properties
	a.s= '.'+a.tab.activeObj; // Div that contains the active form
	a.form= '[form-blob]'; // Div that contains a form blob
	a.map= {}; // Material on form
	
	// __construct()
	$.get(environment.root+'/get/inventory', function(data){
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
	
	// if($(window).width() < 710) a.mobile(form);
	
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
		
		// Reset margin on manual change
		if(a.map[form_id].items[itemID] != undefined){
			if(price != a.map[form_id].items[itemID].price.replace('$', '').replace(',', '') && $('.margin-content').length == 0){
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
Form.prototype.margin = function(form){
	
	var a = this,
		formID = form.attr('data-formid'),
		remDOM = a.p.get('remove'),
		pricemap = {},
		totals = {},
		priceDOM = a.p.get('item-price'),
		formcontent = form.find($(a.p.get('form-content', form))),
		$parent;
	
	var std = function(x){return x.toFixed(2);};
	var comma = function(x){return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');};
	
	// List of current prices on form, and the original price via math (from a.map)
	$.each(a.map[formID].items, function(a,b){
		let itemID = a;
		
		pricemap[itemID] = {
			margin: b.margin,
			current: b.price,
			original: Number(b.price.replace('$', '').replace(',', '')) / b.margin,
		};
	});
	
	// Totals
	totals = {
		subtotal: Number(a.map[formID].subtotal.replace('$', '').replace(',', '')),
		tax: Number(a.map[formID].tax.replace('$', '').replace(',', '')),
		total: Number(a.map[formID].total.replace('$', '').replace(',', '')),
	};
	
	// Darken page, then show the concern
	a.dark(form); // Turn off interaction
	
	var d = Paperwork.dark();
	var dark_container = d.object;
	var fade = d.object.find('.dark_object');
	
	/*
	WARNING: If you change .margin-content, you must change
		update.js to reflect this change. When update.js
		updates each item, it resets the margin if the user 
		has manually changed the price. It does this by 
		checking the length of .margin-content (to see if 
		the interface is open or not) - if you change the 
		class name the length will always return 0 and the 
		margin will always be reset to 0.
	*/
	// Margin content
	fade.after(`
		<div class="margin-content">
			<div class="container">
				<div class="margin-parent">
				</div>
			</div>
		</div>
	`);
	
	var $content = $('.margin-content'),
		$parent = $content.find('.margin-parent');
	
	// Append items 
	$.each(a.map[formID].items, function(a,b){
		
		let original = comma(std(pricemap[a].original));
		
		var percent = (((b.margin * 100) - 100).toFixed(1) !== '0.0') ? 
			` (${((b.margin * 100) - 100).toFixed(1)}%)` : '';
		
		$parent.append(`
			<div class="margin-item wrap lowlight" item-id="${a}">
				<div class="left">
					<input type="checkbox" style="margin-left: 5px;">
				</div>
				<div class="left margin-name">
					${b.item}
				</div>
				<div class="margin-qty left centered">
					${b.quantity}
				</div>
				<div class="margin-price-container left centered">
					<span class="margin-price">
						${b.price}
					</span>
					<span class="margin-percent">
						${percent}
					</span>
				</div>
				<div class="margin-total left">
					${b.total}
				</div>
			</div>
		`);
	});
	
	// Append slider, totals and buttons
	$content.append(`
		<div class="wrap container-mid" style="position: relative;">
			<div class="wrap">
				<div class="container-top centered">
					<input class="percent centered" /> %
				</div>
				<div class="container-top centered">
					<input class="range" type="range" />
				</div>
			</div>
			<div style="position:absolute;right:15px;top:0;border:1px solid black;">
				<ul class="left" style="text-align:right;padding:0;border-right:1px solid black;">
					<li style="padding:2px 10px;">Sub Total</li>
					<li style="padding:2px 10px;">GST</li>
					<li style="padding:2px 10px;font-weight:600;">Total</li>
				</ul>
				<ul class="left" style="text-align:left;padding:0;min-width:93px;">
					<li margin-subtotal style="padding:2px 10px;">$${comma(std(totals.subtotal))}</li>
					<li margin-tax style="padding:2px 10px;">$${comma(std(totals.tax))}</li>
					<li margin-totalend style="padding:2px 10px;font-weight:600;">$${comma(std(totals.total))}</li>
				</ul>
			</div>
		</div>
		<div class="wrap container">
			<button margin-apply class="button right">APPLY</button>
			<button margin-cancel class="button blue right" style="margin-right:5px">CANCEL</button>
		</div>
	`);
	
	// Set input to 0
	$content.find('.percent, .range').val(0);
	
	// Margin content css
	$content.css({
		top: (($(window).height() / 2)) - ($('.margin-content').height() / 2),
	});
	
	// Fade in
	d.run(function(){
		$content.animate({
			opacity: 1
		}, 100);
	});
	
	// ********* FORMDOM ********* //
	
	// Update [cent] from slider - and totals
	var $percent = $content.find('.percent'),
		$range = $content.find('.range');
	
	$content.find('.percent, .range').on('input', function(){
		
		// Normalise both inputs when one changes
		$percent.val($(this).val());
		$range.val($(this).val());
		
		var cent = (Number($percent.val()) + 100) / 100; // Get std cent value - must come after val is set
		
		// Update price and pricemap in real time 
		dark_container.find('.margin-item').each(function(){
			
			var itemID = $(this).attr('item-id');
			
			if($(this).find('input[type=checkbox]')[0].checked){
				
				let price = pricemap[itemID].original,
					qty = $(this).find('.margin-qty').html().replace('$', '').replace(',', ''),
					current = comma(std(price * cent));
				
				$(this).find('.margin-price').html(`$${current}`);
				$(this).find('.margin-percent').html(` (+${Number(((cent * 100) - 100)).toFixed(1)}%)`);
				$(this).find('.margin-total').html(`$${comma(std((price * cent) * qty))}`);
				
				// Update pricemap
				pricemap[itemID].current = current;
				pricemap[itemID].margin = cent;
				
			}
			
			if($(this).find('.margin-percent').html().indexOf('(+0.0%)') !== -1){
				$(this).find('.margin-percent').html('');
			}
		});
		
		var subtotal = 0;
		
		$content.find('.margin-total').each(function(){
			subtotal += Number($(this).html().replace('$', '').replace(',', ''));
		});
		
		subtotal = std(subtotal);
		var tax = std((((subtotal * 3) / 2) / 10));
		var total = std((Number(subtotal)+Number(tax)));
		
		// Totals
		$('[margin-subtotal]').html(`$${comma(subtotal)}`);
		$('[margin-tax]').html(`$${comma(tax)}`);
		$('[margin-totalend]').html(`$${comma(total)}`);
		
	});
	
	// Highlight item if checked
	$('.margin-content input:checkbox').on('change', function(){
		var item = $(this).closest('[item-id]');
		
		if(item.hasClass('lowlight')){
			item.removeClass('lowlight');
		}else{
			item.addClass('lowlight');
		}
	});
	
	// ********* ******** ********* //
	
	// Listen to convert
	$('.margin-content [margin-apply]').on('click', function(){
		
		// Update a.map with new values then update();
		form.find(priceDOM).each(function(){
			var itemID = a.p.get('this-item-id', $(this));
			
			a.map[formID].items[itemID].margin = pricemap[itemID].margin; // Update margin in map
			$(this).html(pricemap[itemID].current); // Update DOM price
		});
		
		a.refresh(form);
		a.update(form);
		
		a.put({
			url: environment.root+'/put/form',
			id: formID,
		});
		
		$content.fadeOut(100, function(){
			d.remove();
		});
	});
	
	// Listen to cancel
	$('.margin-content [margin-cancel]').on('click', function(){
		a.update(form);
		$content.fadeOut(100, function(){
			d.remove(function(){
				a.refresh(form);
				a.update(form);
			});
		});
	});
	
	// Cancel on click out of focus
	fade.on('click', function(){
		a.update(form);
		$content.fadeOut(100, function(){
			d.remove(function(){
				a.refresh(form);
				a.update(form);
			});
		});
	});
	
};
Form.prototype.mobile = function(form){
	/*
	This layer constructs a mobile interface
	*/
	var a= this,
		form_id= form.attr('data-formid'),
		map = a.map[form_id];
	
	if(form.find('[form-date]')) map.date = form.find('[form-date]').html();
	if(form.find('[form-jobid]')) map.job_number = form.find('[form-jobid]').html();
	if(form.find('[form-clientblob]')) map.client = form.find('[form-clientblob]').html();
	if(form.find('[form-jobd]')) map.description = form.find('[form-jobb]').html();
	
	console.log(a.map);
};

Form.prototype.copy = function(form, templates){
	var a= this,
		form_id= form.attr('data-formid'),
		formcontent = form.find($(a.p.get('form-content', form)));
	
	// Darken page, then show the concern
	a.dark(form); // Turn off interaction
	
	var d = Paperwork.dark();
	var dark_container = d.object;
	var fade = d.object.find('.dark_object');
	
	// Copy content
	fade.after(`
		<div class="copy-content">
			<div class="copy-parent wrap">
				<div class="container-top">
					<div class="h4 title centered ">
						Use template:
					</div>
				</div>
				<div class="container-mid">
				</div>
			</div>
		</div>
	`);
	
	$.each(templates, function(a,b){
		$('.copy-content .copy-parent .container-mid').append(`
			<div class="new-template" data-templateid="${a}">
				${b}
			</div>
		`);
	});
	
	$('.copy-content .copy-parent').append(`
		<div class="container wrap">
			<button copy-cancel class="button blue right">
				CANCEL
			</button>
		</div>
	`);
	
	$('.copy-content').css({
		top: (($(window).height() / 2)) - ($('.copy-content').height() / 2),
	});
	
	// Fade in
	d.run(function(){
		$('.copy-content').animate({
			opacity: 1,
		}, 100);
	});
	
	// ********* FORMDOM ********* //
	
	// Listen to template selection
	$('.copy-content .new-template').on('click', function(){
		var data = {
			client: a.p.get('client', form),
			jobd: a.p.get('jobd', form),
			content: a.map[form_id],
		};
		var template_name = $(this).html(),
			template_id = $(this).attr('data-templateid');
		
		d.remove(function(){
			$('.copy-content').off().unbind().remove();
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
			
			var new_form_id = new_form.attr('data-formid');
			
			// Append item to DOM
			$.each(a.map[form_id].items, function(y,z){
				a.p.append(new_form, {
					itemID: z.itemID,
					item: z.item,
					quantity: z.quantity,
					price: z.price
				});
			});
			
			// Update and create map
			a.construct(new_form);
			
			// Clone margins
			$.each(a.map[new_form_id].items, function(y,z){
				a.map[new_form_id].items[y].margin = a.map[form_id].items[y].margin;
			});
			
			// Populate
			a.p.set('client', new_form, data.client);
			a.p.set('jobd', new_form, data.jobd);
			
			// Save
			a.put({
				url: environment.root+'/put/form',
				id: new_form_id,
			});
		});
	});
	
	// Listen to cancel
	$('.copy-content [copy-cancel]').on('click', function(){
		a.update(form);
		$('.copy-content').fadeOut(100, function(){
			d.remove(function(){
				$('.copy-content').off().unbind().remove();
				a.refresh(form);
				a.update(form);
			});
		});
	});
	
	// Cancel on click out of focus
	fade.on('click', function(){
		a.update(form);
		$('.copy-content').fadeOut(100, function(){
			d.remove(function(){
				$('.copy-content').off().unbind().remove();
				a.refresh(form);
				a.update(form);
			});
		});
	});
	
};
Form.prototype.email = function(form){
	var a= this,
		form_id= form.attr('data-formid'),
		formcontent= form.find($(a.p.get('form-content', form))),
		signature,
		password,
		wrong = 0;
	
	// Password from localStorage
	password = localStorage && localStorage.ep != undefined ? localStorage.ep : null;
	
	// Signature
	signature = $('.email-signature-raw').html();
	
	// Darken page, then show the concern
	a.dark(form); // Turn off interaction
	
	var d = Paperwork.dark();
	var dark_container = d.object;
	var fade = d.object.find('.dark_object');
	
	// Email content
	fade.after(`
		<div class="email-content">
			<div class="email-parent wrap container">
				<input class="email-email" type="text" style="width:50%" value="${environment.client_email}" placeholder="Email Address" required />
				<input class="email-subject" type="text" placeholder="Subject Line" required />
				<div class="email-body" style="padding:4px;width:100%;height:300px;border:1px solid #ccc;overflow-y:auto" contenteditable>
					<br>
					${signature}
				</div>
				<i>PDF attached</i>
				<div class="wrap">
					<button email-send class="button right">SEND</button>
					<button email-cancel class="button blue right" style="margin-right:5px">CANCEL</button>
					<input class="email-password right" type="password" name="password" 
						style="height:37px;line-height:37px;width:25%;margin-right:5px" placeholder="Email Password" required />
				</div>
			</div>
		</div>
	`);
	
	// Email content css
	$('.email-content').css({
		top: (($(window).height() / 2)) - ($('.email-content').height() / 2),
	});
	
	// Inject password
	$('.email-content input[name=password]').val(password);
	
	// Fade in
	d.run(function(){
		$('.email-content').animate({
			'opacity': 1
		}, 100);
	});
	
	
	// ********* FORMDOM ********* //
	
	// Listen to send
	$('.email-content [email-send]').on('click', function(){
		
		$('.email-content .email-parent').addClass('no-click');
		$('.email-content .email-parent').css('opacity', '0.5');
		
		$('.email-content .email-parent').append(`
			<div style="width:200px;height:123px;position:absolute;left:0;right:0;top:0;bottom:0;margin:auto;">
				<img src="${environment.root}/css/media/plane.gif" width="200px" />
			</div>
		`);
		
		var address = $('.email-email').val(),
			subject = $('.email-subject').val(),
			body = $('.email-body').html(),
			password = $('.email-password').val(),
			pdf_name,
			pdf_html;
		
		// Get PDF HTML
		a.pdf($(a.s).find(a.form), function(name, data){
			pdf_name = name;
			pdf_html = data;
		});
		
		// Post PDF and Email
		$.post(environment.root+'/post/email', {
			job_number: environment.job_number,
			name: pdf_name,
			html: pdf_html,
			client_name: environment.client_name,
			address: address,
			subject: subject,
			body: body,
			password: password,
		}).done(function(response){
			if(response == 'OK'){
				
				$('.email-content .email-parent').css('opacity', '0');
				$('.email-content').append(`
					<div style="width:95px;position:absolute;left:0;right:0;top:165px;margin:auto;">
						<video autoplay>
							<source src="${environment.root}/css/media/success.webm" type="video/webm">
						</video>
					</div>
				`);
				
				setTimeout(function(){
					$('.email-content').fadeOut(100, function(){
						d.remove(function(){
							$('.email-content').off().unbind().remove();
							a.refresh(form);
							a.update(form);
						});
					});
				}, 1500);
				
				// Cache password
				localStorage.ep = password;
				
			}else if(response == 'Password'){
				
				let message;
				
				if(wrong > 1){
					message = `Do you need to <a href="${environment.root}/settings" target="_blank">update your password</a> in Paperwork?`;
				}else{
					message = 'Wrong password';
				}
				
				$('.email-content .email-parent').removeClass('no-click');
				$('.email-content .email-parent').css('opacity', '1');
				$('.email-content .wait').remove();
				$('.email-content [wrong-password]').remove();
				$('.email-content .email-password').after(`
					<div wrong-password style="color:red;line-height:37px;padding-right:5px" class="right">
						${message}
					<div>
				`);
				wrong++;
			}else{
				$('.email-content .email-parent').css('opacity', '0');
				$('.email-content').append(`
					<div style="text-align:center;position:absolute;left:0;right:0;top:78px;margin:auto;">
						There was a problem sending this email.<br>
						Please make sure your email settings are correct, otherwise email hello@paperwork.nz for support.
					</div>
				`);
			}
		}).fail(function(){
			$('.email-content .email-parent').css('opacity', '0');
			$('.email-content').append(`
				<div style="text-align:center;position:absolute;left:0;right:0;top:78px;margin:auto;">
					There was a problem sending this email.<br>
					Please make sure your email settings are correct, otherwise email hello@paperwork.nz for support.
				</div>
			`);
		});
		
	});
	
	// Listen to cancel
	$('.email-content [email-cancel]').on('click', function(){
		$('.email-content').fadeOut(100, function(){
			d.remove(function(){
				$('.email-content').off().unbind().remove();
				a.refresh(form);
				a.update(form);
			});
		});
	});
	
	// Cancel on click out of focus
	fade.on('click', function(){
		if($('.email-subject').val() == '' && $('.email-body').html().length === 0){
			$('.email-content').fadeOut(100, function(){
				d.remove(function(){
					$('.email-content').off().unbind().remove();
					a.refresh(form);
					a.update(form);
				});
			});
		}
	});
	
};
Form.prototype.pdf = function(form, callback){
	var a= this,
		form_id= form.attr('data-formid'),
		tab= $(`.${a.tab.activeTab}`),
		html= form.clone();
	
	// Strip and get html
	html = a.strip(html);
	
	// PDF
	var name = `${environment.job_number}_${tab.attr('data-tab')}-${tab.html().trim().toLowerCase()}`.trim();
	var page = 
	`
	<!DOCTYPE html>
	<html lang='en'>
	<head>
		<meta name='viewport' content='width=device-width,initial-scale=1.0'>
		<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css' type='text/css'>
	</head>
	<body>
	${html}
	</body>
	`;
	
	// Callback function
	callback(name, page);
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
				objID	= Number($(obj).find(`[${a.tab.heir}]`).attr(a.tab.objhook)),
				form_id	= json.id;
			
			// Create new obj
			$(obj).find(`[${a.tab.heir}]`).before(`
				<div ${a.tab.objhook}="${objID}" class="${a.tab.obj}" hidden>
					${json.html}
				</div>
			`);
			
			$(obj).find(`[${a.tab.heir}]`).replaceWith(`
				<div ${a.tab.objhook}="${(objID + 1)}" ${a.tab.heir} hidden>
				</div>
			`);
			
			// Update data-formid on form-blob
			$(`[${a.tab.objhook}="${objID}"]`).find('[form-blob]').attr('data-formid', form_id);
			
			// Update a.map
			var form = $(`[data-formid="${form_id}"]`);
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