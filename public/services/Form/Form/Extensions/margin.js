Form.prototype.margin = function(form){
	
	var a= this,
		formID= form.attr('data-formid'),
		remDOM = a.p.get('remove'),
		pricemap = {},
		priceDOM = a.p.get('item-price'),
		formcontent = form.find($(a.p.get('form-content', form)));
		
	var std = function(x){return x.toFixed(2);};
	var comma = function(x){return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");};
	
	a.dark(form); // Turn off interaction
	
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
		'min-height':'50px'
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
				'<div style="float:left;width:290px;overflow:hidden;white-space:nowrap;position:relative;margin:0px 10px;height:24px;line-height:24px">'+b.item+'</div>'+
				'<div margin-qty style="float:left;width:50px;border-left:1px solid black;padding:0px 5px;text-align:center;height:24px;line-height:24px">'+b.quantity+'</div>'+
				'<div style="float:left;border-left:1px solid black;padding:0px 5px;width:240px;text-align:center;height:24px;line-height:24px;">$'+comma(std(pricemap[a].original)) + ' > <span margin-price style="font-weight:600">'+b.price+'</span></div>'+
				'<div margin-total style="float:left;border-left:1px solid black;width:70px;text-align:center;height:24px;line-height:24px">'+b.total+'</div>'+
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
				
				$(this).find('span').html('$'+comma(std(price * cent)));
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
				a.update(form);
			});
		});
	});
	
};