Box.Application.addModule('notification', function(context){
	
	function render(message){
		var $element = $('.pw-notification'),
			$notification,
			id;
		
		// Generate random alphanumeric id, length of 6
		id = Paperwork.random(6);
		
		// Append new notification container if none exist
		if($element.length < 1){
			$('body').append(`
				<div class="pw-notification">
				</div>
			`);
			
			$element = $('.pw-notification');
		}
		
		if(message == undefined) message = 'Saved';
		
		$element.append(`
			<notification class="${id}" style="margin-bottom: -15px;">
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
			}, 1000);
		});
		
	}
	
	return {
		onmessage: {
			notification: function(message){
				render(message);
			}
		}
	}
});