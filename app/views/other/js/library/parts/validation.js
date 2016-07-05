function validateDOM(){
	var $forms = $body.find('form'),
		$other = $body.find('[data-validate]').not('form'),
		$items = $forms.add($other);
	
	// Validate forms and any other parent div with data-validate
	$items.each(function(){
		if($(this).data('validate') !== 'off'){
			validate($(this), $(this).find('button').last(), random(6), {
				allowDuplicates: true,
			});
		}
	});
}

function validate($obj, $button, name, flags){
	var elements = 'input[type=text], input[type=email], input[type=password]',
		pref = {};
	
	if(flags != undefined) pref = $.extend(pref, flags);
	
	validationNodes[name] = {};
	
	$obj.on('keyup', elements, function(){
		update(false);
	});
	
	$obj.on('blur', elements, function(){
		update(false);
	});
	
	$button.parent().on('click', function(){
		// User trying to submit form while the form isn't complete
		if($(this).find('button').attr('disabled')) update(true);
	});
	
	update(false);
	
	function update(force){
		var data = [],
			temp = [];
		
		if(force == undefined) force = false;
		
		open();
		
		$obj.find(elements).each(function(){
			var name = $(this).val().trim();
			
			if(name != ''){
				if(temp.indexOf(name) === -1 || pref.allowDuplicates){
					temp.push(name);
					data.push({
						val: name,
						attr: this.attributes,
						status: true,
					});
					$(this).removeClass('not-ok');
				}else{
					data.push({
						val: name,
						attr: this.attributes,
						status: 'duplicate',
					});
					if(force) $(this).addClass('not-ok');
					cancel();
				}
			}else if(!this.hasAttribute('required')){
				data.push({
					val: name,
					attr: this.attributes,
					status: true,
				});
				$(this).removeClass('not-ok');
			}else{
				data.push({
					val: name,
					attr: this.attributes,
					status: 'empty',
				});
				if(force) $(this).addClass('not-ok');
				cancel();
			}
		});
		
		validationNodes[name] = data;
	}
	
	function cancel(){
		$button.attr('disabled', '');
		$button.addClass('spotlight');
	}
	
	function open(){
		$button.removeAttr('disabled');
		$button.removeClass('spotlight');
	}
}