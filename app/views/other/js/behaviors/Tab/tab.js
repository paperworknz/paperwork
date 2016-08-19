Core.addBehavior('tab', function(context, opt){
	
	var $body = context.element;
	
	var tabContainer = '[data-type="tab-container"]',
		objContainer = '[data-type="obj-container"]',
		tabActive = 'active', // Class
		objActive = 'tabopen', // Class
		tab = '[data-type="tab"]',
		obj = '[data-type="obj"]',
		current;
	
	construct();
	bind();
	
	function construct(){
		
		if(context.url.activate) return activate(context.url.activate);
		if(opt.active !== undefined) return activate(opt.active);
		if(getStoredTab()) return activate(getStoredTab());
		
		return activate('first');
	}
	
	function bind(){
		Paperwork.on(`tab.${context.name}.activate`, activate);
		Paperwork.on(`tab.${context.name}.remove`, remove);
		
		$body.on('click', `${tabContainer} ${tab}`, function(){
			activate($(this).data('id'));
		});
	}
	
	function getStoredTab(){
		return sessionStorage[context.name];
	}
	
	function setStoredTab(){
		sessionStorage[context.name] = current;
		return true;
	}
	
	function activate(id){
		
		switch(id){
			case 'first':
				id = $body.find(tab).first().data('id');
				break;
			
			case 'last':
				id = $body.find(tab).last().prev().data('id');
				if(id === undefined) id = $body.find(tab).last().data('id');
				break;
			
			case 'previous':
				id = $body.find(`${tab}.${tabActive}`).prev().data('id');
				if(id === undefined) id = $body.find(tab).first().data('id');
				break;
			
			case 'next':
				id = $body.find(`${tab}.${tabActive}`).next().data('id');
				if(id === undefined) id = $body.find(tab).last().data('id');
				break;
		}
		
		var element = $body.find(tab).filter(`[data-id="${id}"]`);
		var object = $body.find(obj).filter(`[data-id="${id}"]`);
		
		if(element.length === 0){
			id = 0;
			element = $body.find(tab).filter(`[data-id="${id}"]`);
			object = $body.find(obj).filter(`[data-id="${id}"]`);
		}
		
		if(!element.hasClass(tabActive)){ // Clicking an inactive tab
			
			element.addClass(tabActive); // Make tab active
			object.addClass(objActive); // Make corresponding object open
			
			$body.find(tab).each(function(){ // Close all tabs and objs and open the current tab
				if($(this).data('id') != id){
					$(this).removeClass(tabActive);
					$body.find(obj).not(`[data-id="${id}"]`).removeClass(objActive);
				}
			});
		}
		
		current = id;
		setStoredTab(current);
		
		Paperwork.send(`tab.${context.name}.activate.after`, id);
	}
	
	function remove(id){
		
		activate('previous');
		
		$body.find(`[data-type="obj"]`).filter(`[data-id="${id}"]`).remove();
		$body.find(`[data-type="tab"]`).filter(`[data-id="${id}"]`).css({
			width: $body.find(`[data-type="tab"]`).filter(`[data-id="${id}"]`).outerWidth(),
			padding: 0,
		}).html('').animate({
			width: '0px',
		}, 66, function(){
			$(this).remove();
		});
	}
});