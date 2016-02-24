var Table = function(a){
	if(a.width != undefined) this.width = a.width;
	if(a.defaultFilter != undefined) this.dF = a.defaultFilter;
	if(a.cookie != undefined) this.cookie = a.cookie;
	
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
	
	this.default = this.cookie ? this.getCookie('status') ? this.getCookie('status') : this.dF : this.dF;
	this.run();
};

Table.prototype.filter = function(val){
	var a		= this,
		date	= new Date(),
		c		= '';
	
	if(val == 'All'){
		$('.wt-row').each(function(){
			$(this).show();
		})
	}else if(val == 'Hide Completed'){
		$('.wt-row').each(function(){
			$(this).show();
		});
		$('[data-id="Status"] .wt-row').each(function(){
			if($(this).text() == 'Completed'){
				var row = $(this).attr('data-row');
				$('.wt-row').each(function(){
					if($(this).attr('data-row') == row) $(this).hide();
				});
			}
		});
	}else{
		$('.wt-row').each(function(){
			$(this).hide();
		});
		$('[data-id="Status"] .wt-row').each(function(){
			if($(this).text() == val){
				var row = $(this).attr('data-row');
				$('.wt-row').each(function(){
					if($(this).attr('data-row') == row) $(this).show();
				});
			}
		});
	}
	$('.wt-filter').val(val);
	date.setFullYear(date.getFullYear() + 1);
	c = 'status='+val+';expires='+date.toGMTString()+';';
	document.cookie = c; // Post/put cookie
};

Table.prototype.init = function(b){
	var a = this;
	
	a.filter(a.default);
	
	if(b != undefined)
		$('.wt-column').each(function(){
			var c = $(this),
				d = $(this).data('id');
			$.each(b, function(e,f){
				if(e == d) c.css('width', f);
			});
		});
	
	// Resizable columns
	interact('.wt-column').resizable({
		edges: {right: true}
	}).on('resizemove', function(event){
		var target = event.target;
		target.style.width  = event.rect.width + 'px';
	}).allowFrom('.wt-head');
	
	// Sortable columns
	new Sortable(document.getElementById('sortable'), {
		handle: '.wt-head',
		animation: 150,
		ghostClass: 'wt-column-ghost'
	});
	
	// Linkable rows
	$('.wt-row').click(function(){
		if($(this).attr('href') != undefined) window.location = $(this).attr('href');
	});
	
	// Display table
	$('.wt-table').css('display', 'block');
};

Table.prototype.run = function(){
	var a = this;
	a.init(a.width);
	a.hover();
	
	$(document).on('click', '[wt-head]', function(){
		var ul = $(this).closest('.wt-column').attr('data-id'),
			state = $(this).closest('.wt-head').attr('data-state');
		switch(state){
			case 'asc':
				$(this).closest('.wt-head').attr('data-state', 'desc');
				a.sort(ul, 'desc');
				break;
			case 'desc':
				$(this).closest('.wt-head').attr('data-state', 'def');
				a.sort(ul, 'def');
				break;
			case 'def':
				$(this).closest('.wt-head').attr('data-state', 'asc');
				a.sort(ul, 'asc');
				break;
		}
	});
	
	$(document).on('change', '.wt-filter', function(){
		var val = $(this).val();
		a.filter(val);
	});
};

Table.prototype.hover = function(){
	var a = this;
	$('[data-row]').on('mouseover', function(){
		var row = $(this).data('row');
		$('[data-row="'+row+'"]').each(function(){
			$(this).addClass('wt-row-hover');
		});
	});
	$('[data-row]').on('mouseout', function(){
		var row = $(this).data('row');
		$('[data-row="'+row+'"]').each(function(){
			$(this).removeClass('wt-row-hover');
		});
	});
};

Table.prototype.sort = function(ul, state){
	var a = this,
		col = '[data-id="'+ul+'"]',
		li = $(ul).children('li');
	
	switch(state){
		case 'def':
			tinysort(col+' .wt-row', {attr:'data-row'});
			break;
		case 'asc':
			tinysort(col+' .wt-row', {order:'asc'});
			break;
		case 'desc':
			tinysort(col+' .wt-row', {order:'desc'});
			break;
	}
	
	
	var order = [];
	$(col+' .wt-row').each(function(){
		order.push($(this).attr('data-row'));
	});
	
	$('.wt-column').each(function(){
		var me = $(this);
		if(me.attr('data-id') != ul){
			var map = {};
			
			$(me).find('.wt-row').each(function(){
				var el = $(this);
				map[el.attr('data-row')] = el;
			});
			
			for(var i = 0, l = order.length; i < l; i++){
				if(map[order[i]]) me.append(map[order[i]]);
			}
		}
	});
};