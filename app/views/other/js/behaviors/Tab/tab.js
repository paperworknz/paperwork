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
		
		// Activate tab
		if(opt.active !== undefined){
			activate(opt.active);
		}else if(getStoredTab()){
			activate(getStoredTab());
		}else{
			activate('first');
		}
	}
	
	function getStoredTab(){
		return sessionStorage[context.name]
	}
	
	function setStoredTab(){
		sessionStorage[context.name] = current;
	}
	
	function bind(){
		Paperwork.on(`tab.${context.name}.activate`, activate);
		
		$body.on('click', `${tabContainer} ${tab}`, function(){
			Paperwork.send(`tab.${context.name}.activate`, $(this).data('id'));
		});
	}
	
	function activate(id){
		
		switch(id){
			case 'first':
				id = $(tab).first().data('id');
				break;
			
			case 'last':
				id = $(tab).last().prev().data('id');
				if(id === undefined) id = $(tab).last().data('id');
				break;
		}
		
		var element = $body.find(tab).filter(`[data-id="${id}"]`);
		var object = $body.find(obj).filter(`[data-id="${id}"]`);
		
		if(element.length === 0){
			id = 0;
			element = $body.find(tab).filter(`[data-id="${id}"]`);
			object = $body.find(obj).filter(`[data-id="${id}"]`);
		}
		
		if(!element.hasClass(tabActive)){	// Clicking an inactive tab
			
			element.addClass(tabActive);	// Make tab active
			object.addClass(objActive);	// Make corresponding object open
			
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
	
});