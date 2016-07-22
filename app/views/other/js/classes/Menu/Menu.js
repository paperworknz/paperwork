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

if(localStorage.menu != undefined){
	if(localStorage.menu == 'small'){
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
	Paperwork.goto($(this).attr('href'));
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
		let c = 'menu=big;expires='+date.toGMTString()+';path=/;';
		document.cookie = c; // Post/put cookie
		
		localStorage.menu = 'big';
		
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
		let c = 'menu=small;expires='+date.toGMTString()+';path=/;';
		document.cookie = c; // Post/put cookie
		
		localStorage.menu = 'small';
	}
});