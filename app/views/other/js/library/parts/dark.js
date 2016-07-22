function dark($container) {
	var dc = 'dark_container',
		result = '',
		dark_index,
		$dark_module;
	
	if($container == undefined) $container = $('#content');
	result = random(6);
	
	// Index
	dark_index = 50;
	
	// Fade
	$container.after(`
		<div class="${dc}" data-module="${result}">
			<div class="dark_object" disable>
			</div>
		</div>
	`);
	
	$dark_module = $(`.${dc}`).filter(`[data-module="${result}"]`);
	$dark_module.css('z-index', dark_index);
	
	return {
		object: $dark_module,
		run: function(callback){
			$dark_module.find(`.dark_object`).animate({
				opacity: 0.50,
			}, 150, function(){
				if(callback != undefined) callback();
			});
		},
		remove: function(callback){
			$dark_module.find(`.dark_object`).fadeOut(150, function(){
				$dark_module.remove();
				if(callback != undefined) callback();
			});
		},
	};
}