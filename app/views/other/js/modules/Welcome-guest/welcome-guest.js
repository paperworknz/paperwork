Core.addModule('welcome-guest', function(context){
	
	var $body = context.element,
		$message = $body.find('[data-type="message"]');
	
	var i = 0;
	var body_height = 0;
	var messages = {
		0: {
			title: 'Welcome to Paperwork',
			body: `<p>We're going to run you through a quick introduction.</p>`,
		},
		1: {
			title: 'Guest Session',
			body: `<p>You are logged in as a <b>guest</b>.</p>
				<p>Everything you make in Paperwork will be deleted after 24 hours. This is a care-free chance to take Paperwork for 
				a test drive in the quickest manner possible. No sign ups - no credit cards!</p>`,
		},
		2: {
			title: 'Clients',
			body: `<p>It all starts with <b>Clients</b>.</p>
				<p>Clients are your customers, and each client has their own page in Paperwork. To make a client, you only need their full name - 
				but it helps to fill in other details about them as that data can be loaded into quotes automatically.</p>
				<p>Go to the <b>Clients</b> page and click <b>New Client</b> to start.</p>`,
		},
		3: {
			title: 'Jobs',
			body: `<p>One client can have many <b>Jobs</b>.</p>
				<p>Jobs are where you make quotes and invoices. To make a job, you need a client name and a job name.</p>
				<p>Go to the <b>Jobs</b> page and click <b>New Job</b> to start, or, go to a client and click <b>New Job</b>.</p>`,
		},
		4: {
			title: 'Clients and Jobs',
			body: `<p>Clients and Jobs are the only two pages you'll be making - it's that simple! You build up a client list, and make jobs under each client.</p>`,
		},
		5: {
			title: 'Inventory',
			body: `<p>When you enter a material into a Quote, you will be prompted to save the material to your inventory so you can re-use it.</p>
				<p>Go to the <b>Inventory</b> page to get started.</p>`,
		},
		6: {
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