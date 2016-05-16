var Paperwork = function(obj){
	this.preventBackspace();
	this.flow();
};

// ################################ TOGGLES ################################
Paperwork.prototype.preventBackspace = function(){
	var exclusions = 'input, select, textarea, [contenteditable]';
	$(document).on('keydown', function (e){
		if (e.which === 8 && !$(e.target).is(exclusions)){
			e.preventDefault();
		}
	});
};

Paperwork.prototype.flow = function(){
	var elements = 'input[type=text], input[type=email], input[type=password]';
	$(document).on('keydown', elements, function(e){
		var code = e.keyCode || e.which;
		if(code == 13) $(':input:eq(' + ($(':input').index(this) + 1) + ')').focus();
	});
};

// ################################ METHODS ################################
Paperwork.prototype.wait = function(ele){
	ele.addClass('wolfe-btn-wait');
	ele.html('<div class="wait la-ball-fall"><div></div><div></div><div></div></div>');
};

Paperwork.prototype.ready = function(ele, html, func){
	ele.removeClass('wolfe-btn-wait');
	ele.html(html);
	if(func != undefined) func();
};

Paperwork.prototype.saved = function(a, length){
	var ele = $('.pw-notification');
	if(a === undefined) a = 'Saved';
	if(length === undefined) length = 1000;
	ele.html(a);
	
	ele.animate({
		opacity: 0.75,
	}, 100, function(){
	setTimeout(function(){
		ele.animate({
			opacity: 0
		}, 1000, function(){
			ele.html(' ');
		});
	}, length);
	});
};

// *************** MENU
var thumb = $('.thumb');

var width = function(){
	if ($(window).width() < 801){
		thumb.css({"display":"block"});
		$("#menu").css({"display":"none"});
	} else {
		thumb.css({"display":"none"});
		$("#menu").css({"display":"block"});
	}
}

// Initialise
width(); // On load, run width();
$(window).resize(width); // On resize, run width();

// Global click listener
thumb.click(function(){
	$('#menu').slideToggle(125);
	$('#menu').toggleClass('open');
	if($('#menu').hasClass('open')){
		$('#sidebar').after('<div class="menu-disable" style="width:10000px;height:10000px;background-color:transparent;opacity:0.0;position:fixed;top:0;z-index:2;overflow:hidden;" disable></div>');
	}else{
		$('.menu-disable').remove();
	}
	return false; // Stop this listener bubbling up to document
});
$(document).click(function(e){
	if($('#menu').hasClass('open')){
		$('#menu').slideUp(125);
		$('#menu').removeClass('open');
	}
	$('.menu-disable').remove();
});

$('.navbar-hide').on('click', function(){
	var date = new Date();
	
	if($(this).hasClass('small')){
		$('.navbar-hide').html('<');
		$('#sidebar').animate({
			width: '160px'
		}, 100, function(){
			$('#content').animate({
				'margin-left': '160px',
				'padding':'15px 0px 15px 15px'
			}, 100);
			$('.navbar-hide').removeClass('small');
			$('#sidebar li').each(function(){
				$(this).css({
					'text-indent':'20px',
					'text-align':'left'
				});
				$(this).html($(this).attr('val'));
			});
		});
		date.setFullYear(date.getFullYear() + 1);
		c = 'nav=big;expires='+date.toGMTString()+';path=/;';
		document.cookie = c; // Post/put cookie
	}else{
		var i = 0;
		$('#sidebar li').each(function(){
			i++;
			if(i == 1) { e = 'H'; }
			else if(i == 2) { e = 'J'; }
			else if(i == 3) { e = 'C'; }
			else if(i == 4) { e = 'I'; }
			else if(i == 5) { e = 'S'; }
			$(this).css({
				'text-indent':'0',
				'text-align':'center'
			});
			$(this).attr('val', $(this).html());
			$(this).html(e);
		});
		$('#sidebar').animate({
			width: '25px'
		}, 100, function(){
			$('#content').animate({
				'margin-left': '25px',
				'padding':'15px 0px 0px 5px'
			}, 100);
			$('.navbar-hide').html('>');
			$('.navbar-hide').addClass('small');
		});
		date.setFullYear(date.getFullYear() + 1);
		c = 'nav=small;expires='+date.toGMTString()+';path=/;';
		document.cookie = c; // Post/put cookie
	}
});