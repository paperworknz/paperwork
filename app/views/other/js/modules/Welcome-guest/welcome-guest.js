Core.addModule('welcome-guest', function(context){
	
	var $body = context.element,
		$message = $body.find('[data-type="message"]');
	
	var i = 0;
	var body_height = 0;
	var messages = {
		0: {
			title: 'Welcome to Paperwork',
			body: `<p>Let's run through a quick introduction!</p>`,
		},
		1: {
			title: 'Navigation',
			body: `<p>Navigate around Paperwork by using the side panel on the left. (or above on mobile)</p>
				<p>You can also enable <b>voice control</b> in your <b>settings</b>, then say "Open inventory," to open your inventory. 
				Voice control is currently only available in Google Chrome on a computer, or on Android.</p>`,
		},
		2: {
			title: 'Templates',
			body: `<p>Your templates are used to make Quotes and Invoices. How you design your template is up to you, but 
				if you set up your personal details in your settings you can use @ symbols to automatically fill your templates.</p>
				<p>Go to the <b>Templates</b> page to start.`,
		},
		3: {
			title: 'Clients',
			body: `<p>It all starts with <b>Clients</b>.</p>
				<p>Clients are your customers, and each client has their own page in Paperwork. To make a client, you only need their full name - 
				but it helps to fill in other details about them as that data can be loaded into quotes automatically.</p>
				<p>Go to the <b>Clients</b> page and click <b>New Client</b> to start.</p>`,
		},
		4: {
			title: 'Jobs',
			body: `<p>One client can have many <b>Jobs</b>.</p>
				<p>Jobs are where you make quotes and invoices. To make a job, you need a client name and a job name.</p>
				<p>Go to the <b>Jobs</b> page and click <b>New Job</b> to start, or, go to a client and click <b>New Job</b>.</p>`,
		},
		5: {
			title: 'Clients and Jobs',
			body: `<p>Clients and Jobs are the only two pages you'll be making - it's that simple! You build up a client list, and make jobs under each client.</p>`,
		},
		6: {
			title: 'Inventory',
			body: `<p>When you enter a material into a Quote, you will be prompted to save the material to your inventory so you can re-use it.</p>
				<p>Go to the <b>Inventory</b> page to get started.</p>`,
		},
		7: {
			title: `Let's get into it`,
			body: `<p>We recommend you start by going to your <b>Settings</b> and update your details. Then go and set up your <b>Templates</b>, 
				then create a new <b>Client</b> and <b>Job</b>.</p>
				<p class="negligible">By the way, Paperwork is best used on a larger screen with a keyboard.</p>`,
		},
	};
	
	render();
	run();
	
	function run(){
		$body.on('click', '[data-type="next-step"]', function(event){
			i++;
			$body.find('[data-type="parent"]').animate({
				opacity: 0,
			}, 100, function(){
				render();
				$body.find('[data-type="next-step"]').html('GOT IT');
				
				let new_height = $body.outerHeight();
				
				$body.css('height', body_height);
				$body.animate({
					height: new_height
				}, 200, 'swing', function(){
					$body.find('[data-type="parent"]').animate({
						opacity: 1,
					}, 100);
				});
			});
		});
	}
	
	function render(){
		if(!messages[i]){
			$body.remove();
			if(sessionStorage) sessionStorage.introduction = 'true';
			return Paperwork.goto(`${environment.root}/settings`);
		}
		
		$body.css('height', '');
		body_height = $body.outerHeight();
		
		$body.find('[data-type="title"]').html(messages[i].title);
		$body.find('[data-type="message"]').html(messages[i].body);
	}
});