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
		var itemID = a,
			margin = b.margin;
		
		pricemap[itemID] = { 
			current: b.price,
			original: Number(b.price.replace('$', '').replace(',', '')) / margin,
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
	
	// Container
	$('#content').after(`
		<div margin>
		</div>
	`);
	
	// Fade
	$('[margin]').append(`
		<div fade style="width:10000px;height:10000px;background-color:black;opacity:0.0;position:fixed;top:0;z-index:2;overflow:hidden;" disable>
		</div>
	`);
	
	// Margin content
	$('[fade]').after(`
		<div margin-content>
		</div>
	`);
	$('[margin-content]').css({
		position:'absolute',
		zIndex:999,
		top:formcontent.offset().top - 51,
		left:formcontent.offset().left - 30,
		width:'710px',
		backgroundColor:'white',
		border:'none',
		minHeight:'50px',
		opacity: '0.00'
	});
	$('[margin-content]').html(`
		<div margin-parent>
		</div>
	`);
	
	// Margin parent
	$('[margin-parent]').css({
		margin:'10px',
		border: '1px solid black'
	});
	
	// Append items 
	$.each(a.map[formID].items, function(a,b){
		
		if(((b.margin * 100) - 100).toFixed(1) !== '0.0'){
			var percent = ` (${((b.margin * 100) - 100).toFixed(1)}%)`;
		}else{
			var percent = '';
		}
		
		$('[margin-parent]').append(`
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
	
	// $${comma(std(pricemap[a].original))}>  <---- original price
	
	// Append slider, totals and buttons
	$('[margin] [margin-content]').append(`
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
	$('[margin] [cent], [margin] [range]').val(0);
	
	// Fade in 
	$('[fade]').animate({'opacity':0.66}, 150, function(){
		$('[margin] [margin-content]').animate({
			opacity: 1
		}, 100);
	});
	
	// ********* FORMDOM ********* //
	
	// Update [cent] from slider - and totals
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
				
				$(this).find('[margin-price]').html(`$${comma(std(price * cent))}`);
				$(this).find('[margin-percent]').html(` (+${Number(((cent*100)-100)).toFixed(1)}%)`);
				$(this).find('[margin-total]').html(`$${comma(std((price * cent) * qty))}`);
				
				// Update a.map margin property 
				a.map[formID].items[itemID].margin = cent;
			}
			
			if($(this).find('[margin-percent]').html().indexOf('(+0.0%)') !== -1){
				$(this).find('[margin-percent]').html('');
			}
		});
		
		var subtotal = 0;
		
		$('[margin] [margin-total]').each(function(){
			subtotal += Number($(this).html().replace('$', '').replace(',', ''));
		});
		
		subtotal = std(subtotal);
		var tax = std((((subtotal * 3) / 2) / 10));
		var total = std((Number(subtotal)+Number(tax)));
		
		// Totals
		$('[margin] [margin-subtotal]').html(`$${comma(subtotal)}`);
		$('[margin] [margin-tax]').html(`$${comma(tax)}`);
		$('[margin] [margin-totalend]').html(`$${comma(total)}`);
		
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
		
		a.put({
			url: environment.root+'/put/form',
			id: formID,
		});
		
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