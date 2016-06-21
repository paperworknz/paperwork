/*

Form.1.7.js relies on tab.activeTab being the active tab,
having the attribute [data-tab], and the direct html content
of this ele should be text and equal to the form's name.

*/
var Tab = function(data){
	var a = this;
	this.activeTab	= data.activeTab != undefined ? data.activeTab : 'active';
	this.activeObj	= data.activeObj != undefined ? data.activeObj : 'tabopen';
	this.tabParent	= data.tabParent != undefined ? data.tabParent : '.tabs';
	this.objParent	= data.objParent != undefined ? data.objParent : '.obj';
	this.tab		= 'tab';
	this.obj		= 'tabobj'
	this.heir		= 'heir';
	this.tabhook	= 'data-tab';
	this.objhook	= 'data-obj';
	this.current	= 0;
	this.name;
	this.method;
	
	Events.on('activateTab', function(response){
		a.activate($(`[${a.tabhook}="${response}"]`));
	});
	
	// Tab.js instance name, method of storage
	if(data.name == undefined){
		this.name = window.location.pathname.substr(1);
		this.method = 'session';
	}else{
		this.name = data.name;
		this.method = 'local';
	}
	
	// Storage key name
	this.key = 'tab_'+this.name;
	
	// Set last opened tab
	this.setTab = function(){
		this.method == 'session' ?
			sessionStorage[this.key] = this.current :
			localStorage[this.key] = this.current;
	};
	
	// Get last opened tab
	this.getTab = function(){
		
		// Store in session if the tab instance doesn't have a name
		// or persist in Local Storage if it does;
		this.method == 'session' ?
			this.current = sessionStorage[this.key] :
			this.current = localStorage[this.key];
		
		if(this.current == undefined) this.current = 0;
	};
	
	// Set current to last opened tab
	this.getTab();
	
	// Activate from storage
	var first = $(`[${this.tabhook}="${this.current}"]`);
	first.hasClass(this.tab) ?
		this.activate(first) :
		this.activate($(`[${this.tabhook}="0"]`));
	
	// LISSEN DOOD
	var a = this;
	$(this.tabParent).on('click', `[${this.tabhook}]`, function(){
		a.activate($(this));
	});
	
	// Display content
	$('#content').css('display', 'block');
};

Tab.prototype.activate = function(tab){
	var a		= this,
		tabID	= tab.data('tab'),
		obj		= $(`[${a.objhook}="${tabID}"]`),
		date	= new Date(),
		c;
	
	if(!tab.hasClass(a.activeTab)){	// Clicking an inactive tab
		tab.addClass(a.activeTab);	// Make tab active
		$(obj).addClass(a.activeObj);	// Make corresponding object open
		$(`[${a.tabhook}]`).each(function(){ // Close all tabs and objs and open the current tab
			if($(this).data('tab') != tabID){
				$(this).removeClass(a.activeTab);
				if(!$(this).is(`[${a.heir}]`)){
					$(`[${a.objhook}="${$(this).data('tab')}"]`).attr('hidden', '');
				}
				$(`[${a.objhook}="${$(this).data('tab')}"]`).removeClass(a.activeObj);
			}
		});
	}
	
	// Update current tab
	a.current = tabID;
	
	// Display the obj
	$(obj).removeAttr('hidden');
	
	// Save
	a.setTab();
};

Tab.prototype.append = function(templateName, call){
	var a		= this,
		tab		= a.tabParent,
		tabID	= Number($(tab).find(`[${a.heir}]`).data('tab'));
	
	// Create new tab
	$(tab).find(`[${a.heir}]`).before(`
		<li data-tab="${tabID}" class="tab" style="display: none;">
			${templateName}
		</div>
	`);
	
	$(tab).find(`[${a.heir}]`).replaceWith(`
		<li data-tab="${tabID + 1}" ${a.heir} hidden>
		</li>
	`);
	
	// Animate tab
	$(`[${a.tabhook}="${tabID}"]`).animate({
		width: 'toggle'
	}, 80, function(){
		// Make tab active
		a.activate($(`[${a.tabhook}="${tabID}"]`));
		if(call != undefined) call(tabID);
	});
};