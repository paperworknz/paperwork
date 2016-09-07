Core.addModule('hello', function(context){
	
	var $body = context.element;
	
	var i = 0;
	var body_height = 0;
	var messages = {
		0: {
			title: 'Welcome to Paperwork',
			body:
			``,
			fn: function(){
				
			},
		},
	};
	
	render();
	run();
	
	function run(){
		$body.on('click', '[data-type="next-step"]', function(event){
			i++;
			$body.find('[data-type="parent"]').animate({
				opacity: 0,
			}, 100, function(){
				render();
				$body.find('[data-type="next-step"]').html('GOT IT');
				
				let new_height = $body.outerHeight();
				
				$body.css('height', body_height);
				$body.animate({
					height: new_height
				}, 200, 'swing', function(){
					$body.find('[data-type="parent"]').animate({
						opacity: 1,
					}, 100);
				});
			});
		});
	}
	
	function render(){
		if(!messages[i]){
			if(sessionStorage) sessionStorage.introduction = 'true';
			return context.stop();
		}
		
		$body.css('height', '');
		body_height = $body.outerHeight();
		
		$body.find('[data-type="title"]').html(messages[i].title);
		// $body.find('[data-type="view"]').html(messages[i].body);
	}
});