var Paperwork = function(obj){
	this.preventBackspace();
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

Paperwork.prototype.saved = function(a){
	var ele = $('.pw-notification');
	if(a === undefined) a = 'Saved';
	ele.html(a);
	
	ele.animate({
		opacity: 0.75,
	}, 100, function(){
	setTimeout(function(){
		ele.animate({
			opacity: 0
		}, 1000);
	}, 1000);
	});
};

// *************** TO BE DEPRECATED
var thumb = $("#navbar .thumb");     
function width(){
	if ($(window).width() < 801){
		thumb.css({"display":"block"});
		$("#menu").css({"display":"none"});
	} else {
		thumb.css({"display":"none"});
		$("#menu").css({"display":"block"});
	}
}
thumb.click(function(){$("#menu").slideToggle(125);});
width();
$(window).resize(width);
$('.navbar-hide').on('click', function(){
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
	}
});