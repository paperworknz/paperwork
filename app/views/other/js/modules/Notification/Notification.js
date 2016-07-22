Core.addModule('notification', function(context){
	
	var $body = context.element;
	
	// Bind
	Paperwork.on('notification', render);
	
	function render(message){
		var $notification,
			id = Paperwork.random(6);
		
		if(message == undefined) message = 'Saved';
		
		$body.append(`
			<notification data-type="${id}" style="margin-bottom: -15px;">
				${message}
			</notification>
		`);
		
		$notification = $body.find(`notification[data-type="${id}"]`);
		
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
	
});