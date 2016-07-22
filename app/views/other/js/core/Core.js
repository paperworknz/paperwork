var Core = (function($, undefined){
	
	var modules = {};
	var behaviors = {};
	var services = {};
	
	function addModule(name, fn){
		if(modules[name]){
			console.warn(`Module name '${name}' already assigned`);
			return false;
		}
		
		return modules[name] = {
			status: false,
			run: fn,
			stop: function(){
				$(`[data-module="${name}"]`).off().unbind();
			},
		}
	}
	
	function addBehavior(name, fn){
		if(behaviors[name]){
			console.warn(`Behavior name '${name}' already assigned`);
			return false;
		}
		
		return behaviors[name] = fn;
	}
	
	function addService(name, fn){
		if(services[name]){
			console.warn(`Service name '${name}' already assigned`);
			return false;
		}
		
		return services[name] = fn;
	}
	
	function loadModule(name, data){
		
		var dark,
			$module,
			depend,
			map = {};
		
		var request = data ? `${environment.root}/get/module/${name}/${data}` : `${environment.root}/get/module/${name}`
		
		$.get(request)
		.done(function(response){
			
			response = JSON.parse(response);
			if(response.type == 'error') return console.warn(response.message);
			
			dark = require('dark')
			if(!dark) return console.warn(`Service 'dark' undefined`);
			dark.run();
			
			$module = $(`
				<part class="dark_content" style="opacity: 0;">
					<module data-module="${name}">
						${response.module}
					</module>
				</part>
			`).appendTo(dark.object);
			
			// If module is already defined, skip script/css loading
			if(modules[name]){
				stop(name);
				return render();
			}
			
			loadThird();
			
			function loadThird(){
				if(response.third){
					for(let i in response.third){
						const value = response.third[i];
						
						map[value] = false;
						$.getScript(`${environment.root}/js/3rd/${value}.js`, function(){
							map[value] = true;
						});
					}
					
					depend = setInterval(function(){
						wait(loadClasses);
					}, 25);
				}
			}
			
			function loadClasses(){
				if(response.classes){
					for(let i in response.classes){
						const value = response.classes[i];
						
						map[value] = false;
						$.getScript(`${environment.root}/js/classes/${value}`, function(){
							map[value] = true;
						});
					}
					
					depend = setInterval(function(){
						wait(loadSelf);
					}, 25);
				}
			}
			
			function loadSelf(){
				if(response.css)
					$('<link type="text/css" rel="stylesheet">').appendTo('head').attr('href', `${environment.root}/css/modules/${response.css}`);
				
				if(!response.js)
					return console.warn('Module js does not exist in cache');
				
				$.getScript(`${environment.root}/js/modules/${response.js}`, render);
			}
			
			function wait(fn){
				for(let i in map){
					const value = map[i];
					
					if(value === false) return;
				}
				
				clearInterval(depend);
				fn();
			}
			
			function render(){
				
				start(name);
				
				dark.object.find('.dark_content').addClass('pop');
				$module.animate({
					opacity: 1,
				}, 100);
				
				return start(name);
			}
		});
	}
	
	function loadBehavior(name, callback){
		if(behaviors[name]){
			console.log('cached tab');
			return callback ? callback() : true;
		}
		
		$.getScript(`${environment.root}/js/behaviors/${name}.js`)
		.done(callback);
	}
	
	function start(name){
		if(!modules[name]) return undefined;
		if(modules[name].status) return true;
		
		var instance = modules[name].run(getContext(name)) || {};
		
		if(instance.onload) instance.onload();
		if(instance.start) instance.start();
		
		return modules[name].status = true;
	}
	
	function stop(name){
		if(!modules[name]) return undefined;
		
		modules[name].status = false;
		modules[name].stop();
		return true;
	}
	
	function getContext(name){
		var $element = Paperwork.body.find(`[data-module="${name}"]`);
		
		var context = {
			name: name,
			element: $element,
			require: require,
			stop: function(){
				return stop(name);
			}
		};
		
		context.use = function(behavior, options){
			use(name, behavior, options);
		}
		
		return context;
	}
	
	function use(origin, name, options){
		var context = getContext(origin);
		
		if(!options) options = {};
		delete context.use;
		
		if(behaviors[name]) return behaviors[name](context, options);
		
		loadBehavior(name, function(){
			return new behaviors[name](context, options);
		});
	}
	
	function require(name){
		if(!services[name]){
			console.warn(`Service ${name} is undefined`);
			return;
		}
		
		return services[name]();
	}
	
	return {
		require: require,
		loadModule: loadModule,
		addModule: addModule,
		addBehavior: addBehavior,
		addService: addService,
		start: start,
		stop: stop,
		startAll: function(){
			for(let i in modules) start(i);
		},
		stopAll: function(){
			for(let i in modules) stop(i);
		},
	}
	
})(jQuery);