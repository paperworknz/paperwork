Core.addService('dark', function(){
	var dc = 'dark_container',
		result = Paperwork.random(6),
		dark_index = 49,
		$dark_module;
	
	var instance;
	
	construct();
	
	function construct($container){
		
		if($container == undefined) $container = Paperwork.body;
		
		$dark_module = $(`
			<div class="${dc}" data-module="${result}" style="z-index: ${dark_index}">
				<div class="dark_object" disable>
				</div>
			</div>
		`).appendTo($container);
	}
	
	function run(name){
		
		$dark_module.attr('data-instanceof', name);
		$dark_module.find(`.dark_object`).animate({
			opacity: 0.50,
		}, 150);
		
		// Bind
		$(window).on('keyup', function(event){
			if(event.keyCode !== 27) return false;
			
			Core.stop(name);
		});
		
		$(`.${dc}`).on('click', function(){
			
			Core.stop(name);
		});
		$(`.${dc}`).on('click', 'module', function(event){
			event.stopPropagation();
		});
	}
	
	function remove(){
		
		var instance = $dark_module.data('instanceof');
		
		// Fade out all elements apart from .dark_object backdrop
		$dark_module.find('>*:not(.dark_object)').fadeOut(150);
		
		$dark_module.find(`.dark_object`).delay(150).fadeOut(150, function(){
			$dark_module.remove();
		});
	}
	
	return {
		object: $dark_module,
		run: run,
		remove: remove,
	};
});