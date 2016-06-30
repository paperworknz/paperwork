Form.prototype.refresh = function(form){
	var a= this;
	
	// Listeners
	a.dark(form); // Remove jQuery listeners
	$(a.tab.objParent).on('change', function(){ a.update(form) });
	a.p.on('qty', $(a.tab.objParent), 'input', function(){ a.update(form) });
	a.p.on('qty', $(a.tab.objParent), 'keypress', function(event){
		if(event.event.which == 13){
			event.event.preventDefault();
			a.update(form);
		}
	});
	a.p.on('price', $(a.tab.objParent), 'blur', function(event){
		if(event.event.which == 13){
			event.event.preventDefault();
			$('.tt-input').focus();
		}
		
		a.update(form);
	});
	a.p.on('price', $(a.tab.objParent), 'keypress', function(event){
		if(event.event.which == 13){
			event.event.preventDefault();
			$('.tt-input').focus();
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