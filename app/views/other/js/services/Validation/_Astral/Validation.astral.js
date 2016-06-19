var Validation = function(){
	this.data = {};
};

// Input returns a validated array of inputs inside obj
Validation.prototype.input = function(obj, button, name, flags){
	var a = this;
	var elements = 'input[type=text], input[type=email], input[type=password]';
	
	var pref = {
		allowDuplicates: false,
	};
	
	if(flags != undefined) pref = $.extend(pref, flags);
	
	a.data[name] = {};
	
	var update = function(force){
		var data = [],
			temp = [];
		
		if(force == undefined) force = false;
		
		open();
		
		obj.find(elements).each(function(){
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
		
		a.data[name] = data;
		
	};
	
	var cancel = function(){
		button.attr('disabled', '');
		button.addClass('spotlight');
	};
	
	var open = function(){
		button.removeAttr('disabled');
		button.removeClass('spotlight');
	};
	
	obj.on('keyup', elements, function(){
		update(false);
	});
	
	obj.on('blur', elements, function(){
		update(false);
	});
	
	button.parent().on('click', function(){
		// User trying to submit form while the form isn't complete
		if($(this).find('button').attr('disabled')){
			update(true);
		}
	});
	
	update(false);
};