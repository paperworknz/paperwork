var Notification = (function($, environment, Events){
	
	var chain,
		notifications = [];
	
	//-> parts/render.js
	
	function run(){
		$.post(environment.root+'/get/notification', {
			page: environment.page,
		}).done(function(data){
			if(data){
				if(data = JSON.parse(data)){
					notifications = data;
					if(data.length > 1) chain = 0;
					
					render(data[0]);
				}
			}
		});
	}
	
	return {
		run: run,
		render: render,
	};
	
})(jQuery, environment, Events);