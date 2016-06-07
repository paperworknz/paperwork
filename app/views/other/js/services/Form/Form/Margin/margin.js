Form.prototype.margin = function(form){
	
	var a= this,
		formID= form.attr('data-formid'),
		remDOM= a.p.get('remove'),
		pricemap= {},
		totals= {},
		priceDOM= a.p.get('item-price'),
		formcontent= form.find($(a.p.get('form-content', form)));
	
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
	
	var d = dark();
	var dark_container = d.object;
	var fade = d.object.find('.dark_object');
	
	/*
	WARNING: If you change .margin-content, you must change
		update.js to reflect this change. When update.js
		updates each item, at the end it resets the margin
		if the user has manually changed the price. It does
		this by checking the length of .margin-content (to
		see if the interface is open or not) - if you change
		the class name the length will always return 0 and 
		the margin will always be reset to 0.
	*/
	// Margin content
	fade.after(`
		<div class="margin-content">
			<div class="margin-parent">
			</div>
		</div>
	`);
	
	// Margin content css
	$('.margin-content').css({
		top: formcontent.offset().top - 51,
		left: formcontent.offset().left - 30,
	});
	
	// Append items 
	$.each(a.map[formID].items, function(a,b){
		
		if(((b.margin * 100) - 100).toFixed(1) !== '0.0'){
			var percent = ` (${((b.margin * 100) - 100).toFixed(1)}%)`;
		}else{
			var percent = '';
		}
		
		let original = comma(std(pricemap[a].original));
		
		$('.margin-content .margin-parent').append(`
			<div class="margin-item wrapper lowlight" item-id="${a}">
				<input type="checkbox" style="float:left;margin-left:5px">
				<div style="float:left;width:273px;overflow:hidden;white-space:nowrap;position:relative;margin-left:5px;margin-right:10px;height:24px;line-height:24px">${b.item}</div>
				<div margin-qty style="float:left;width:58px;border-left:1px solid black;padding:0px 5px;text-align:center;height:24px;line-height:24px">${b.quantity}</div>
				<div style="float:left;border-left:1px solid black;padding:0px 5px;width:230px;text-align:center;height:24px;line-height:24px;">
					<span margin-price style="font-weight:600">${b.price}</span><span margin-percent>${percent}</span>
				</div>
				<div margin-total style="float:left;border-left:1px solid black;text-align:left;height:24px;line-height:24px;padding-left:10px;">${b.total}</div>
			</div>
		`);
	});
	
	// Append slider, totals and buttons
	$('.margin-content').append(`
		<div class="wrapper" style="position:relative;">
			<div class="wrapper">
				<div class="ac" style="padding:10px 10px 0px 10px;">
					<input cent style="width:60px;text-align:center" /> %
				</div>
				<div style="width:100%;padding:10px;">
					<input range type="range" style="width:200px;margin:0 auto">
				</div>
			</div>
			<div style="position:absolute;right:10px;top:0;border:1px solid black;">
				<ul class="pull-left" style="text-align:right;padding:0;border-right:1px solid black;">
					<li style="padding:2px 10px;">Sub Total</li>
					<li style="padding:2px 10px;">GST</li>
					<li style="padding:2px 10px;font-weight:600;">Total</li>
				</ul>
				<ul class="pull-left" style="text-align:left;padding:0;min-width:93px;">
					<li margin-subtotal style="padding:2px 10px;">$${comma(std(totals.subtotal))}</li>
					<li margin-tax style="padding:2px 10px;">$${comma(std(totals.tax))}</li>
					<li margin-totalend style="padding:2px 10px;font-weight:600;">$${comma(std(totals.total))}</li>
				</ul>
			</div>
		</div>
		<div class="wrapper" style="padding:10px">
			<button margin-apply class="wolfe-btn pull-right">APPLY</button>
			<button margin-cancel class="wolfe-btn blue pull-right" style="margin-right:5px">CANCEL</button>
		</div>
	`);
	
	// Set input to 0
	$('.margin-content [cent], .margin-content [range]').val(0);
	
	// Fade in
	d.run(function(){
		$('.margin-content').animate({
			opacity: 1
		}, 100);
	});
	
	// ********* FORMDOM ********* //
	
	// Update [cent] from slider - and totals
	$('.margin-content [range], .margin-content [cent]').on('input', function(){
		
		// Normalise both inputs when one changes
		$('.margin-content [cent]').val($(this).val());
		$('.margin-content [range]').val($(this).val());
		
		var cent = (Number(dark_container.find('[cent]').val()) + 100) / 100; // Get std cent value - must come after val is set
		
		// Update price and pricemap in real time 
		dark_container.find('.margin-item').each(function(){
			
			var itemID = $(this).attr('item-id');
			
			if($(this).find('input[type=checkbox]')[0].checked){
				
				let price = pricemap[itemID].original,
					qty = $(this).find('[margin-qty]').html().replace('$', '').replace(',', ''),
					current = comma(std(price * cent));
				
				$(this).find('[margin-price]').html(`$${current}`);
				$(this).find('[margin-percent]').html(` (+${Number(((cent * 100) - 100)).toFixed(1)}%)`);
				$(this).find('[margin-total]').html(`$${comma(std((price * cent) * qty))}`);
				
				// Update pricemap
				pricemap[itemID].current = current;
				pricemap[itemID].margin = cent;
				
			}
			
			if($(this).find('[margin-percent]').html().indexOf('(+0.0%)') !== -1){
				$(this).find('[margin-percent]').html('');
			}
		});
		
		var subtotal = 0;
		
		$('.margin-content [margin-total]').each(function(){
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
		
		$('.margin-content').fadeOut(100, function(){
			d.remove();
		});
	});
	
	// Listen to cancel
	$('.margin-content [margin-cancel]').on('click', function(){
		a.update(form);
		$('.margin-content').fadeOut(100, function(){
			d.remove(function(){
				a.refresh(form);
				a.update(form);
			});
		});
	});
	
	// Cancel on click out of focus
	fade.on('click', function(){
		a.update(form);
		$('.margin-content').fadeOut(100, function(){
			d.remove(function(){
				a.refresh(form);
				a.update(form);
			});
		});
	});
	
};