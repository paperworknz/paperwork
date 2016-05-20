/*

Form.1.7.js relies on tab.activeTab being the active tab,
having the attribute [data-tab], and the direct html content
of this ele should be text and equal to the form's name.

*/
var Tab = function(data){
	this.activeTab	= data.activeTab != undefined ? data.activeTab : 'active';
	this.activeObj	= data.activeObj != undefined ? data.activeObj : 'tabopen';
	this.tabParent	= data.tabParent != undefined ? data.tabParent : '.tabs';
	this.objParent	= data.objParent != undefined ? data.objParent : '.obj';
	this.cookie		= data.cookie != undefined ? data.cookie : false;
	this.tab		= 'tab';
	this.obj		= 'tabobj'
	this.heir		= 'heir';
	this.tabhook	= 'data-tab';
	this.objhook	= 'data-obj';
	this.h			= 'h';
	
	if(this.cookie.value == undefined) this.cookie.value = '';
	
	this.getCookie	= function(key){
		var name = key + '=', ca = document.cookie.split(';');
		for(var i = 0; i < ca.length; i++){
			var c = ca[i];
			while (c.charAt(0) == ' ') c = c.substring(1);
			if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
		}
		return '';
	};
	
	this.current = this.cookie ? 
		this.getCookie(this.cookie.name+'.'+this.cookie.value+'.tab') ? 
			this.getCookie(this.cookie.name+'.'+this.cookie.value+'.tab') 
			: 0 
		: 0;
	
	// Activate from cookie
	var first = $('['+this.tabhook+'="'+this.current+'"]')
	first.hasClass(this.tab) ?
		this.activate(first) :
		this.activate($('['+this.tabhook+'="0"]'));
	
	// LISTEN
	var a = this;
	$(this.tabParent).on('click', '['+this.tabhook+']', function(){
		a.activate($(this));
	});
};

Tab.prototype.activate = function(tab){
	var a		= this,
		tabID	= tab.data('tab'),
		obj		= $('['+a.objhook+'="'+tabID+'"]'),
		date	= new Date(),
		c		= '';
	
	if(!tab.hasClass(a.activeTab)){	// Clicking an inactive tab
		tab.addClass(a.activeTab);	// Make tab active
		$(obj).addClass(a.activeObj);	// Make corresponding object open
		$('['+a.tabhook+']').each(function(){ // Close all tabs and objs and open the current tab
			if($(this).data('tab') != tabID){
				$(this).removeClass(a.activeTab);
				if(!$(this).is('['+a.heir+']')){
					$('['+a.objhook+'="'+$(this).data('tab')+'"]').addClass(a.h);
				}
				$('['+a.objhook+'="'+$(this).data('tab')+'"]').removeClass(a.activeObj);
			}
		});
	}
	$(obj).removeClass(a.h); // Display the obj
	date.setFullYear(date.getFullYear() + 1);
	c = a.cookie.name+'.' +a.cookie.value+ '.tab='+tabID+';expires='+date.toGMTString()+';';
	document.cookie = c; // Post/put cookie
	
	// Display content
	$('#content').css('display', 'block');
};

Tab.prototype.append = function(templateName, call){
	var a		= this,
		tab		= a.tabParent,
		tabID	= Number($(tab).find('['+a.heir+']').data('tab'));
	
	// Create new tab
	$(tab).find('['+a.heir+']').before('<li data-tab="'+tabID+'" class="tab noselect" style="display:none">'+templateName+'</div>');
	$(tab).find('['+a.heir+']').replaceWith('<li data-tab="'+(tabID + 1)+'" '+a.heir+' hidden></li>');
	
	// Animate tab
	$('['+a.tabhook+'="'+tabID+'"]').animate({width: 'toggle'}, 80, function(){
		// Make tab active
		a.activate($('['+a.tabhook+'="'+tabID+'"]'));
		if(call != undefined) call(tabID);
	});
};