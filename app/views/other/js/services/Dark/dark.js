Core.addService('dark', function(){
	var dc = 'dark_container',
		result = Paperwork.random(6),
		dark_index = 49,
		$dark_module;
	
	construct();
	
	// Bind
	$(window).on('keyup', function(event){
		if(event.keyCode === 27) remove();
		return false;
	});
	
	function construct($container){
		
		if($container == undefined) $container = Paperwork.body;
		
		$dark_module = $(`
			<div class="${dc}" data-module="${result}">
				<div class="dark_object" disable>
				</div>
			</div>
		`).appendTo($container);
		
		$dark_module.css('z-index', dark_index);
		
		$dark_module.on('click', '.dark_object', remove);
	}
	
	function run(callback){
		$dark_module.find(`.dark_object`).animate({
			opacity: 0.50,
		}, 150, function(){
			if(callback != undefined) callback();
		});
	}
	
	function remove(callback){
		if($dark_module.find('*:not(.dark_object)').length){
			$dark_module.find('*:not(.dark_object)').fadeOut(150, end);
		}else{
			end();
		}
		
		function end(){
			$dark_module.find(`.dark_object`).fadeOut(150, function(){
				$dark_module.remove();
				if(typeof callback === 'function') return callback();
				return;
			});
		}
	}
	
	return {
		object: $dark_module,
		run: run,
		remove: remove,
	};
});