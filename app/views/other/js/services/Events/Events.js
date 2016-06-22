var Events = (function(){
	
	const events = {};
	
	function on(event, fn){
		events[event] = events[event] || [];
		events[event].push(fn);
	}
	
	function off(event, fn){
		// Remove event from events object
		if(events[event]) for(let i = 0; i < events[event].length; i++) if(events[event][i] === fn) events[event].splice(i, 1);
	}
	
	function post(event, response){
		// Fire all functions in event object that match event
		if(events[event]) events[event].forEach(function(fn){ fn(response); });
	}
	
	return {
		on: on,
		off: off,
		post: post,
	}
})();