var Validation = function(){
	this.data = {};
};

// Input returns a validated array of inputs inside obj
Validation.prototype.input = function(obj, button, name, flags){
	var a = this;
	var elements = 'input[type=text], input[type=email], input[type=password]';
	
	var pref = {
		'allowDuplicates': false,
		'visible': false,
	};
	
	if(flags != undefined) pref = $.extend(pref, flags);
	
	a.data[name] = {};
	
	var update = function(vis){
		var data = [],
			temp = [];
		
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
					if(pref.visible && vis || vis == 'force') $(this).addClass('not-ok');
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
				if(pref.visible && vis || vis == 'force') $(this).addClass('not-ok');
				cancel();
			}
		});
		
		a.data[name] = data;
		
	};
	
	var cancel = function(){
		button.addClass('no-click');
		button.addClass('spotlight');
	};
	
	var open = function(){
		button.removeClass('no-click');
		button.removeClass('spotlight');
	};
	
	obj.on('blur', elements, function(){
		update(true);
	});
	
	button.parent().on('click', function(){
		// User trying to submit form while the form isn't complete
		if($(this).find('button').hasClass('no-click')){
			update('force');
		}
	});
	
	update(false);
};