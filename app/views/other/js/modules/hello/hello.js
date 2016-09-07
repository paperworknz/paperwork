Core.addModule('hello', function(context){
	
	var $body = context.element;
	
	var i = 0;
	var body_height = 0;
	var request = {};
	
	run();
	
	function run(){
		$body.on('click', '[data-type="next-step"]', function(event){
			
			i++;
			
			$body.find('[data-type="parent"]').animate({
				opacity: 0,
			}, 100, render);
		});
	}
	
	function render(){
		
		let new_height;
		
		if(i > 1){
			
			return;
		}
		
		$body.css('height', '');
		body_height = $body.outerHeight();
		
		$body.find('[data-type="one"]').hide();
		$body.find('[data-type="two"]').show();
		
		new_height = $body.outerHeight();
		$body.css('height', body_height);
		
		$body.animate({
			height: new_height
		}, 200, 'swing', function(){
			$body.find('[data-type="parent"]').animate({
				opacity: 1,
			}, 100);
		});
	}
});