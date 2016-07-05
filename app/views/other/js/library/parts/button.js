function wait($element){
	if($element.data('button-state') !== 'off'){
		
		$element.css({
			width: $element.outerWidth(),
			height: $element.outerHeight(),
		});
		
		$element.addClass('button-wait');
		$element.html(`
			<div class="wait la-ball-fall">
				<div></div>
				<div></div>
				<div></div>
			</div>
		`);
	}
}

function ready($element, html, callback){
	$element.css({
		width: '',
		height: '',
	});
	$element.removeClass('button-wait');
	$element.html(html);
	if(callback != undefined) callback();
}

function applyWaitToButtons(){
	$body.on('click', '.button', function(){
		wait($(this));
	});
}