var Tour = (function($, environment, Events){
	
	var chain,
		items = [];
	
	//-> parts/render.js
	//-> parts/commands.js
	
	function run(){
		$.post(environment.root+'/get/tour', {
			page: environment.page,
		}).done(function(data){
			if(data){
				data = JSON.parse(data);
				if(data.length > 1) chain = 0;
				render(data[0]);
			}
		});
	}
	
	return {
		run: run,
		render: render,
	};
	
})(jQuery, environment, Events);