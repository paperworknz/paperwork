var Paperwork = (function(){
	
	const $body = $('body');
	const events = {};
	var validationNodes = {};
	
	preventBackspace(); // preventBackspace.js
	overrideLinks(); // goto.js
	applyWaitToButtons(); // button.js
	formFlow(); // formFlow.js
	validateDOM(); // validation.js
	
	// Append notification container to body
	if(!$body.find('.pw-notification').length) $body.append(`<div class="pw-notification" data-module="notification"></div>`);
	
	//-> parts/preventBackspace.js
	//-> parts/formFlow.js
	
	//-> parts/events.js
	//-> parts/random.js
	//-> parts/goto.js
	//-> parts/since.js
	//-> parts/button.js
	//-> parts/validation.js
	//-> parts/dark.js
	//-> parts/countdown.js
	//-> parts/dollar.js
	
	return {
		body: $body,
		on: on,
		off: off,
		send: send,
		random: random,
		goto: goto,
		since: since,
		wait: wait,
		ready: ready,
		validate: validate,
		dark: dark,
		countdown: countdown,
		dollar: dollar,
	}
	
})();