Core.addModule('clients', function(context){
	
	var $body = context.element;
	
	var typeahead = [];
	var clients = [];
	
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
			$body.find('#the-basics').fadeIn(250);
			$body.find('.tt-input').focus();
		});
	}
	
	function bind(){
		$body.off();
		
		// Toggle new client view
		$body.on('click', '.create-new', function(){
			$body.find('#new-content').slideToggle(100);
		});
		
		// Add new client from button
		$body.on('click', '[data-type="new-client"]', function(){
			
			var name = $body.find('input[name=name]').val();
			
			if(!name.length) return;
			
			$.post(request.post, {
				name: name,
			}).done(function(response){
				var response = JSON.parse(response);
				
				if(response.type != 'success'){
					return Paperwork.send('flash', {
						type: 'error',
						message: response.message,
					});
				}
				
				add(response.client.client_number, response.client.name);
			});
		});
		
		// Run typeahead
		$body.find('.typeahead').typeahead({
			hint: true,
			highlight: true,
			minLength: 0
		}, {
			source: substringMatcher(typeahead),
			limit: 1000000
		});
		
		// Enter key to select first result
		$body.on('keydown', '.typeahead', function(event){
			
			var e = jQuery.Event(`keydown`);
			e.keyCode = e.which = 9; // 9 == tab
			
			if (event.which == 13){ // if pressing enter
				$body.find('.typeahead').trigger(e);
				goto();
			}
		});
		
		// Browse to client on typeahead selection
		$body.on('typeahead:beforeclose', '.typeahead', function(event){
			event.preventDefault();
		});
		
		// Browse to client on typeahead selection
		$body.on('typeahead:selected', '.typeahead', goto);
		
		// Focus on typeahead
		$body.find('input.tt-input').focus();
		
	}
	
	function add(client_number, name){
		
		// Add client name to top of typeahead
		typeahead.unshift(name);
		
		// Add client to clients
		clients.push({
			client_number: client_number,
			name: name,
		});
		
		// Reset typeahead
		$body.find('#the-basics').html('<input type="text" class="typeahead" placeholder="Quick Search">');
		Paperwork.ready($body.find('[data-type="new-client"]'), 'CREATE');
		bind();
	}
	
	function goto(){
		var client = $body.find('.tt-input').val();
		
		for(let i in clients){
			const value = clients[i];
			
			if(value.name == client) Paperwork.goto(`${environment.root}/client/${value.client_number}`);
		}
		
	}
	
});