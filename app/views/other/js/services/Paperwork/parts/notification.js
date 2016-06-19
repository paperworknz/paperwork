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