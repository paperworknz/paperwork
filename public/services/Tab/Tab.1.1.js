var Tab = function(data){
	this.active		= data.active ? data.active : '.active';
	this.open		= data.activeObj ? data.activeObj : '.tabopen';
	this.activeRaw	= data.activeTab.replace(/[\.]+/g, ''); // Remove .
	this.openRaw	= data.activeObj.replace(/[\.]+/g, ''); // Remove .
	this.tP			= data.tabParent;
	this.oP			= data.objParent;
	this.heir		= data.heir;
	this.heirRaw	= data.heir.replace(/[\[\]]+/g, ''); // Remove []
	this.tab		= '[data-tab]';
	this.obj		= '[data-obj]';
	this.tabRaw		= 'data-tab';
	this.objRaw 	= 'data-obj';
	this.h			= 'h';
	this.cookie		= data.cookie != undefined ? data.cookie : false;
	
	this.getCookie	= function(key){
		var name	= key + '=',
			ca		= document.cookie.split(';');
		for(var i=0; i<ca.length; i++){
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
};

Tab.prototype.run = function(){
	var a		= this,
		current	= $('[data-tab="' + a.current + '"]');
	
	if(current.hasClass('tab')){
		
		a.activate(current);
	}else{
		a.activate($('[data-tab="0"]'));
	}
	$(a.tP).on('click', a.tab, function(){
		a.activate($(this));
	});
};

Tab.prototype.activate = function(tab){
	var a		= this,
		tabID	= tab.data('tab'),
		obj		= $('['+a.objRaw+'="'+tabID+'"]'),
		date	= new Date(),
		c		= '';
	
	if(!tab.hasClass(a.activeRaw)){	// Clicking an inactive tab
		tab.addClass(a.activeRaw);	// Make tab active
		$(obj).addClass(a.openRaw);	// Make corresponding object open
		$(a.tab).each(function(){ // Close all tabs and objs and open the current tab
			if($(this).data('tab') != tabID){
				$(this).removeClass(a.activeRaw);
				if(!$(this).is(a.heir)){
					$('['+a.objRaw+'="'+$(this).data('tab')+'"]').addClass(a.h);
				}
				$('['+a.objRaw+'="'+$(this).data('tab')+'"]').removeClass(a.openRaw);
			}
		});
	}
	$(obj).removeClass(a.h); // Display the obj
	date.setFullYear(date.getFullYear() + 1);
	c = a.cookie.name+'.' +a.cookie.value+ '.tab='+tabID+';expires='+date.toGMTString()+';';
	document.cookie = c; // Post/put cookie
	$('#content').css('display', 'block');
};

Tab.prototype.append = function(templateName, call){
	var a		= this,
		tab		= a.tP,
		tabID	= Number($(tab).find(a.heir).data('tab'));
	
	// Create new tab
	$(tab).find(a.heir).before('<li data-tab="'+tabID+'" class="tab noselect" style="display:none">'+templateName+'</div>');
	$(tab).find(a.heir).replaceWith('<li data-tab="'+(tabID + 1)+'" '+a.heirRaw+' hidden></li>');
	
	// Animate tab
	$('['+a.tabRaw+'="'+tabID+'"]').animate({width: 'toggle'}, 80, function(){
		// Make tab active
		a.activate($('['+a.tabRaw+'="'+tabID+'"]'));
		if(call != undefined) call();
	});
};