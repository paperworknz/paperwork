var Tour = (function($, environment, Events){
	
	var chain,
		items = [];
	
	//-> parts/commands.js
	//-> parts/position.js
	//-> parts/render.js
	//-> parts/remove.js
	
	function run(){
		$.post(environment.root+'/get/tour', {
			page: environment.page,
		}).done(function(data){
			if(data){
				items = JSON.parse(data);
				if(items.length > 1) chain = 0;
				render(items[0]);
			}
		});
	}
	
	return {
		run: run,
		render: render,
	};
	
})(jQuery, environment, Events);