var Paperwork = (function(){
	
	const $body = $('body');
	var validationNodes = {};
	
	preventBackspace(); // preventBackspace.js
	overrideLinks(); // goto.js
	applyWaitToButtons(); // button.js
	formFlow(); // formFlow.js
	validateDOM(); // validation.js
	
	//-> parts/preventBackspace.js
	//-> parts/formFlow.js
	
	//-> parts/random.js
	//-> parts/goto.js
	//-> parts/since.js
	//-> parts/button.js
	//-> parts/validation.js
	//-> parts/dark.js
	//-> parts/countdown.js
	
	return {
		random: random,
		goto: goto,
		since: since,
		wait: wait,
		ready: ready,
		validate: validate,
		nodes: validationNodes,
		dark: dark,
		countdown: countdown,
	}
	
})();