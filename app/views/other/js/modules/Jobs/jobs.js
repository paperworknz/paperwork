Core.addModule('jobs', function(context){
	
	var $body = context.element;
	
	var typeahead = [];
	var clients = [];
	var status = {};
	
	var request = {
		get: `${environment.root}/get/clients`,
		post: `${environment.root}/post/client`,
	};
	
	construct();
	
	function construct(){
		$.get(request.get)
		.done(function(response){
			clients = JSON.parse(response);
			for(let i in clients) typeahead.push(clients[i].name);
			
			bind();
		});
	}
	
	function bind(){
		
		$body.off();
		
		// Toggle new job view
		$body.on('click', '.create-new', function(){
			$body.find('#new-content').slideToggle(100);
		});
		
		// Run typeahead
		$body.find('.typeahead').typeahead({
			hint: true,
			highlight: true,
			minLength: 1
		}, {
			source: substringMatcher(typeahead)
		});
	}
	
});