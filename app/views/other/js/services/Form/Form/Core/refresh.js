Form.prototype.refresh = function(form){
	var a= this;
	
	// Listeners
	a.dark(form); // Remove jQuery listeners
	$(a.tab.objParent).on('change', function(){ a.update(form) });
	a.p.on('qty', $(a.tab.objParent), 'input', function(){ a.update(form) });
	a.p.on('price', $(a.tab.objParent), 'blur', function(){ a.update(form) });
	a.p.on('price', $(a.tab.objParent), 'input', function(event){
		if(event.event.keyCode == 13){
			event.event.preventDefault();
			event.element.blur();
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
	
	// Update form-pdf-name
	var tabID = $('.'+a.tab.activeTab).attr(a.tab.tabhook),
		tname = $('.'+a.tab.activeTab).html();
	form.closest('.'+a.tab.obj).find('[form-pdf-name]').val(tabID+'-'+tname.toLowerCase());
};