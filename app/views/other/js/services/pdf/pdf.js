Core.addService('pdf', function(){
	
	var api = {
		post: `${environment.root}/post/pdf`,
	};
	
	function post(properties, callback){
		
		var directory = properties.directory;
		delete properties.directory;
		
		$.post(api.post, {
			directory: directory,
			properties: properties,
		}).done(function(response){
			
			try {
				response = JSON.parse(response);
			}catch(e) {
				return callback(false);
			}
			
			if(response.type == 'error') return callback(false);
			
			return callback(response);
		});
	}
	
	return {
		post: post,
	}
});