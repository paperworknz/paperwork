function dark(container) {
	var container = container != undefined ? con : $('#content'),
		dc = 'dark_container',
		chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
		result = '';
	
	darkIndex++;
	
	// Generate random string, length of 6
	for(var i = 6; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
	
	// Fade
	container.after(`
		<div class="${dc}" data-module="${result}">
			<div class="dark_object" disable>
			</div>
		</div>
	`);
	
	var $dark_module = $(`.${dc}`).filter(`[data-module="${result}"]`);
	$dark_module.css('z-index', darkIndex);
	
	// Return dark_instance
	return {
		object: $dark_module,
		run: function(callback){
			$dark_module.find(`.dark_object`).animate({
				opacity: 0.66,
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