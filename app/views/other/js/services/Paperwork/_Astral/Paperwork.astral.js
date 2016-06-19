var Paperwork = (function(){
	
	const $document = $('body');
	var darkIndex = 49;
	
	var preventBackspace = (function(){
		let exclusions = 'input, select, textarea, [contenteditable]';
		$document.on('keydown', function(event){
			let code = event.keyCode || event.which,
				$target = $(event.target);
			
			if(code === 8 && !$target.is(exclusions)) event.preventDefault();
		});
	})();
	
	var flow = (function(){
		let elements = 'input[type=text], input[type=email], input[type=password]';
		$document.on('keydown', elements, function(event){
			let code = event.keyCode || event.which,
				$next = $(`:input:eq(${($(':input').index(this) + 1)})`);
			
			if(code === 13){
				$next.focus();
				if(!$next.is('button')) event.preventDefault();
			}
		});
	})();
	
	function wait($element){
		$element.addClass('button-wait');
		$element.html(`
			<div class="wait la-ball-fall">
				<div></div>
				<div></div>
				<div></div>
			</div>
		`);
	}
	
	function ready($element, html, callback){
		$element.removeClass('button-wait');
		$element.html(html);
		if(callback != undefined) callback();
	}
	
function saved(message, length){
	var $element,
		$notification,
		chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
		id = '';
	
	// Generate random string, length of 6
	for(var i = 6; i > 0; --i) id += chars[Math.floor(Math.random() * chars.length)];
	
	$element = $('.pw-notification');
	if($element.length < 1){
		$document.append(`
			<div class="pw-notification">
			</div>
		`);
		
		$element = $('.pw-notification');
	}
	
	if(message == undefined) message = 'Saved';
	if(length == undefined) length = 1000;
	
	$element.append(`
		<notification class="${id}" style="margin-bottom: -15px">
			${message}
		</notification>
	`);
	
	$notification = $(`.${id}`);
	
	$notification.animate({
		opacity: 0.75,
		marginBottom: '5px',
	}, 100, function(){
		setTimeout(function(){
			$notification.animate({
				opacity: 0
			}, 1000, function(){
				$notification.remove();
			});
		}, length);
	});
}
function dark(container) {
	var container = container != undefined ? con : $('#content'),
		dc = 'dark_container',
		chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
		result = '';
	
	darkIndex++;
	
	// Generate random string, length of 6
	for(var i = 6; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
	
	// Fade
	container.after(`
		<div class="${dc}" data-module="${result}">
			<div class="dark_object" disable>
			</div>
		</div>
	`);
	
	var $dark_module = $(`.${dc}`).filter(`[data-module="${result}"]`);
	$dark_module.css('z-index', darkIndex);
	
	// Return dark_instance
	return {
		object: $dark_module,
		run: function(callback){
			$dark_module.find(`.dark_object`).animate({
				opacity: 0.66,
			}, 150, function(){
				if(callback != undefined) callback();
			});
		},
		remove: function(callback){
			$dark_module.find(`.dark_object`).fadeOut(150, function(){
				$dark_module.remove();
				if(callback != undefined) callback();
			});
		},
	};
}
	
	return {
		wait: wait,
		ready: ready,
		saved: saved,
		dark: dark,
		dark_instance: function(){
			return dark_instance;
		}
	};
	
})();

function since(timeStamp) {
	var now = new Date(),
		stamp = timeStamp.split(/[- :]/),
		timeStamp = new Date(stamp[0], stamp[1]-1, stamp[2], stamp[3], stamp[4], stamp[5]),
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
		let day = timeStamp.getDate();
		let month = timeStamp.toDateString().match(/ [a-zA-Z]*/)[0].replace(' ','');
		let year = timeStamp.getFullYear() == now.getFullYear() ? '' :  ' '+timeStamp.getFullYear();
		return day + ' ' + month + year;
	}
};

function goto(location) {
	
	$('#content').animate({
		opacity: 0,
	}, 'fast');
	
	window.location = location;
};

$('a').on('click', function(e){
	if($(this).attr('href')){
		e.preventDefault();
		goto($(this).attr('href'));
	}
});

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
		// $('#content').css({
		// 	marginLeft: '25px',
		// 	padding: '15px 0px 0px 15px',
		// });
	}
}

// Scaffolding nav clicks
$('#menu li').on('click', function(){
	$('#menu li').removeClass('nav_active');
	$(this).addClass('nav_active');
	goto($(this).attr('href'));
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
			// $('#content').animate({
			// 	marginLeft: '160px',
			// 	padding: '15px 0px 15px 15px'
			// }, 100);
			$('#sidebar li').each(function(){
				$(this).css({
					textIndent: '20px',
					textAlign: 'left',
				});
				$(this).html($(this).attr('val'));
			});
			$('.navbar-hide').removeClass('small');
		});
		
		date.setFullYear(date.getFullYear() + 1);
		let c = 'sidebar=big;expires='+date.toGMTString()+';path=/;';
		document.cookie = c; // Post/put cookie
		
		localStorage.sidebar = 'big';
		
	}else{
		$('#sidebar li').each(function(){
			var letter = $(this).html().trim().charAt(0);
			$(this).css({
				textIndent: '0',
				textAlign: 'center',
			});
			$(this).attr('val', $(this).html());
			$(this).html(letter);
		});
		$('#sidebar').animate({
			width: '25px'
		}, 100, function(){
			// $('#content').animate({
			// 	marginLeft: '25px',
			// 	padding: '15px 0px 0px 15px',
			// }, 100);
			$('.navbar-hide').html(' > ');
			$('.navbar-hide').addClass('small');
		});
		
		date.setFullYear(date.getFullYear() + 1);
		let c = 'sidebar=small;expires='+date.toGMTString()+';path=/;';
		document.cookie = c; // Post/put cookie
		
		localStorage.sidebar = 'small';
	}
});