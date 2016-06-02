var Paperwork = function(obj){
	this.preventBackspace();
	this.flow();
};

// ################################ TOGGLES ################################
Paperwork.prototype.preventBackspace = function(){
	var exclusions = 'input, select, textarea, [contenteditable]';
	
	$(document).on('keydown', function(e){
		if(e.which === 8 && !$(e.target).is(exclusions)) e.preventDefault(); 
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

if(localStorage.sidebar != undefined){
	if(localStorage.sidebar == 'small'){
		$('#content').css({
			'margin-left': '25px',
			'padding':'15px 0px 0px 15px',
		});
	}
}
$('#content').css({
	//marginTop: '-5px',
	opacity: 0,
	display: 'block'
});
$('#content').animate({
	opacity: 1,
}, 'fast');

// Scaffolding nav clicks
$('#menu li').on('click', function(){
	$('#menu li').removeClass('nav_active');
	$(this).addClass('nav_active');
	$('#content').animate({
		opacity: 0,
	}, 'medium');
	window.location = $(this).attr('href');
});

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
		$('.navbar-hide').html(' < ');
		$('#sidebar').animate({
			width: '160px'
		}, 100, function(){
			$('#content').animate({
				'margin-left': '160px',
				'padding':'15px 0px 15px 15px'
			}, 100);
			$('#sidebar li').each(function(){
				$(this).css({
					'text-indent':'20px',
					'text-align':'left'
				});
				$(this).html($(this).attr('val'));
			});
			$('.navbar-hide').removeClass('small');
		});
		
		date.setFullYear(date.getFullYear() + 1);
		c = 'sidebar=big;expires='+date.toGMTString()+';path=/;';
		document.cookie = c; // Post/put cookie
		
		localStorage.sidebar = 'big';
		
	}else{
		$('#sidebar li').each(function(){
			var letter = $(this).html().trim().charAt(0);
			console.log(letter);
			$(this).css({
				'text-indent':'0',
				'text-align':'center'
			});
			$(this).attr('val', $(this).html());
			$(this).html(letter);
		});
		$('#sidebar').animate({
			width: '25px'
		}, 100, function(){
			$('#content').animate({
				'margin-left': '25px',
				'padding':'15px 0px 0px 15px',
			}, 100);
			$('.navbar-hide').html(' > ');
			$('.navbar-hide').addClass('small');
		});
		
		date.setFullYear(date.getFullYear() + 1);
		c = 'sidebar=small;expires='+date.toGMTString()+';path=/;';
		document.cookie = c; // Post/put cookie
		
		localStorage.sidebar = 'small';
	}
});

function since(timeStamp) {
	var now = new Date(),
		stamp = timeStamp.split(/[- :]/),
		timeStamp = new Date(stamp[0], stamp[1]-1, stamp[2], stamp[3], stamp[4], stamp[5]);
		secondsPast = (now.getTime() - timeStamp.getTime()) / 1000;
	
	if(secondsPast < 60){
		return parseInt(secondsPast) + 's ago';
	}
	if(secondsPast < 3600){
		return parseInt(secondsPast/60) + 'm ago';
	}
	if(secondsPast <= 86400){
		return parseInt(secondsPast/3600) + 'h ago';
	}
	if(secondsPast > 86400){
		day = timeStamp.getDate();
		month = timeStamp.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ","");
		year = timeStamp.getFullYear() == now.getFullYear() ? "" :  " "+timeStamp.getFullYear();
		return day + " " + month + year;
	}
}