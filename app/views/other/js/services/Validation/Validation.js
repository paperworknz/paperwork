var Validation = function(){
	this.data = {};
};

// Input returns a validated array of inputs inside obj
Validation.prototype.input = function(obj, button, name){
	var a = this;
	var elements = 'input[type=text], input[type=email], input[type=password]';
	
	a.data[name] = {};
	
	var update = function(type){
		var data = [],
			temp = [];
		
		open();
		
		$(obj).find(elements).each(function(){
			var name = $(this).val().trim();
			
			if(name != ''){
				if(temp.indexOf(name) === -1){
					temp.push(name);
					data.push({
						val: name,
						attr: this.attributes,
						status: true,
					});
					if(type != 'silent'){
						$(this).removeClass('not-ok');
					}
				}else{
					data.push({
						val: name,
						attr: this.attributes,
						status: 'duplicate',
					});
					if(type != 'silent'){
						$(this).addClass('not-ok');
						cancel();
					}
				}
			}else{
				data.push({
					val: name,
					attr: this.attributes,
					status: 'empty',
				});
				if(type != 'silent'){
					$(this).addClass('not-ok');
					cancel();
				}
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
	
	$(obj).on('blur', elements, function(){
		update();
	});
	
	update('silent');
};