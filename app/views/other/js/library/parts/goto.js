function goto(location) {
	
	$('#content').animate({
		opacity: 0,
	}, 'fast');
	
	window.location = location;
}

function overrideLinks(){

	$body.on('click', 'a', function(e){
		if($(this).attr('href')){
			e.preventDefault();
			goto($(this).attr('href'));
		}
	});
}