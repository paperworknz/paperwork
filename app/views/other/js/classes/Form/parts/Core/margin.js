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
			<button margin-cancel class="button blue right" style="margin-right:5px" data-button-state="off">CANCEL</button>
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