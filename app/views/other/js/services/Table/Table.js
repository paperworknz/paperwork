var Table = function(a){
	
	this.map = {
		filter: 'Hide Completed',
		columns: {},
	};
	
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
	
	this.setCookie = function(){
		var a = this,
			date = new Date();
		
		date.setFullYear(date.getFullYear() + 1);
		c = 'map='+JSON.stringify(a.map)+';expires='+date.toGMTString()+';';
		document.cookie = c; // Post/put cookie
	};
	
	if(this.getCookie('map') !== '') this.map = JSON.parse(this.getCookie('map'));
	this.filter(this.map.filter);
	this.hover();
	this.init();
	this.run();
	
};

Table.prototype.init = function(){
	var a = this;
	
	// Create map
	$('.wt-column').each(function(index){
		var c = $(this),
			d = $(this).data('id');
		
		if(a.map.columns[d] !== undefined){
			// Set Width
			c.css('width', a.map.columns[d].width);
		}else{
			a.map.columns[d] = {
				width: c.width() + 'px',
				index: index,
				state: $(this).find('.wt-head').attr('data-state'),
				stateOrder: index,
			};
			a.setCookie();
		}
	});
	
	// Set states by stateOrder
	var order = [];
	
	$.each(a.map.columns, function(a,b){
		order[b.stateOrder] = a;
	});
	
	order.reverse(); // Sort 4, 3, 2...
	
	// Apply sort function in order from first to last
	$.each(order, function(b,c){
		var column = $('.wt-column[data-id="'+c+'"]');
		
		if(a.map.columns[c].state == 'asc'){
			column.find('img').css('display', 'block');
			column.find('img').attr('src', environment.root+'/css/app/media/up.png');
			column.find('.wt-head').attr('data-state', 'asc');
			a.sort(c, 'asc');
		}else if(a.map.columns[c].state == 'desc'){
			column.find('img').css('display', 'block');
			column.find('img').attr('src', environment.root+'/css/app/media/down.png');
			column.find('.wt-head').attr('data-state', 'desc');
			a.sort(c, 'desc');
		}else if(a.map.columns[c].state == 'def'){
			column.find('img').css('display', 'none');
			column.find('.wt-head').attr('data-state', 'def');
			a.sort(c, 'def');
		}
	});
	
	// Set Index for each column
	var order = [];
	
	$.each(a.map.columns, function(a,b){
		order[b.index] = $('.wt-column[data-id="'+a+'"]');
	});
	
	$.each(order, function(a,b){
		$('.wt-wrap').append(b);
	});
	
	// Resizable columns
	interact('.wt-column').resizable({
		edges: {right: true}
	}).on('resizemove', function(event){
		var target = event.target,
			id = $(target).attr('data-id'),
			width = event.rect.width + 'px';
		
		target.style.width = width; // Update css width
		a.map.columns[id].width = width; // Update a.map
		a.setCookie();
		
	}).allowFrom('.wt-head');
	
	// Sortable columns Draggable
	new Sortable(document.getElementById('sortable'), {
		handle: '.wt-head',
		animation: 150,
		ghostClass: 'wt-column-ghost',
		onEnd: function(event){
			$.each($('.wt-column'), function(event){
				a.map.columns[$(this).attr('data-id')].index = event;
				a.setCookie();
			});
		}
	});
	
	// Linkable rows
	$('.wt-row').click(function(){
		if($(this).attr('href') != undefined) window.location = $(this).attr('href');
	});
	
	// Display table
	$('.wt-table').css('display', 'block');
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

Table.prototype.run = function(){
	var a = this;
	
	$(document).on('click', '[wt-head]', function(){
		a.state($(this));
	});
	
	$(document).on('change', '.wt-filter', function(){
		var val = $(this).val();
		a.filter(val);
	});
	
};

Table.prototype.state = function(obj){
	var a = this,
		d = obj.closest('.wt-column').attr('data-id'),
		state = obj.parent('.wt-head').attr('data-state'),
		order = [];
	
	// Initialise (state)order
	$.each(a.map.columns, function(a,b){
		order[b.stateOrder] = a;
	});
	
	// Move clicked item to front of sortOrder
	if(state != 'desc'){
		order.moveTo(d, 0);
	}else{
		order.moveTo(d, 'end');
	}
	
	// Update a.map based off order
	$.each(a.map.columns, function(b,c){
		var newPos = order.indexOf(b);
		a.map.columns[b].stateOrder = newPos;
	});
	
	switch(state){
		case 'asc':
			a.map.columns[d].state = 'desc';
			obj.find('img').css('display', 'block');
			obj.find('img').attr('src', environment.root+'/css/app/media/down.png');
			obj.parent('.wt-head').attr('data-state', 'desc');
			a.sort(d, 'desc');
			break;
		case 'desc':
			a.map.columns[d].state = 'def';
			obj.find('img').css('display', 'none');
			obj.parent('.wt-head').attr('data-state', 'def');
			a.sort(d, 'def');
			break;
		case 'def':
			a.map.columns[d].state = 'asc';
			obj.find('img').css('display', 'block');
			obj.find('img').attr('src', environment.root+'/css/app/media/up.png');
			obj.parent('.wt-head').attr('data-state', 'asc');
			a.sort(d, 'asc');
			break;
	}
	
	a.setCookie();
};

Table.prototype.filter = function(val){
	var a	= this,
		c	= '';
	
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
	a.map.filter = val;
	a.setCookie();
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

Array.prototype.moveTo = function(item, to) {
    var index = this.indexOf(item);
    
    if(index === -1) 
        throw new Error("Element not found in array");
    
    if(to < 0) 
        to = 0;
	
	if(to == 'end')
		to = this.length + 1;
        
    this.splice(index,1);
    this.splice(to,0,item);
};