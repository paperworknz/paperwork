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