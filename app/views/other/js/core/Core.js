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
		if(behaviors[name]) return true;
		
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
		
		var request = data ? `${environment.root}/get/module/${name}/${data}` : `${environment.root}/get/module/${name}`;
		
		$.get(request)
		.done(function(response){
			
			response = JSON.parse(response);
			if(response.type == 'error') return console.warn(response.message);
			
			dark = require('dark')
			if(!dark) return console.warn(`Service 'dark' undefined`);
			dark.run(name);
			
			$module = $(`
				<part class="dark_content" style="opacity: 0;">
					<module data-module="${name}">
						${response.module}
					</module>
				</part>
			`).appendTo(dark.object);
			
			// If module is already defined, skip all css/script loading
			if(modules[name]){
				stop(name);
				return render();
			}
			
			loadThird();
			
			function loadThird(){
				
				if(!response.third) return loadClasses();
				
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
			
			function loadClasses(){
				
				if(!response.classes) return loadBehaviors();
				
				for(let i in response.classes){
					const value = response.classes[i];
					
					map[value] = false;
					$.getScript(`${environment.root}/js/classes/${value}`, function(){
						map[value] = true;
					});
				}
				
				depend = setInterval(function(){
					wait(loadBehaviors);
				}, 25);
			}
			
			function loadBehaviors(){
				
				if(!response.behaviors) return loadSelf();
				
				for(let i in response.behaviors){
					const value = response.behaviors[i];
					
					map[value] = false;
					loadBehavior(value, function(){
						map[value] = true;
					});
				}
				
				depend = setInterval(function(){
					wait(loadSelf);
				}, 25);
			}
			
			function loadSelf(){
				if(response.css) $('<link type="text/css" rel="stylesheet">').appendTo('head').attr('href', `${environment.root}/css/modules/${response.css}`);
				if(!response.js) return console.warn('Module js does not exist in cache');
				
				$.getScript(`${environment.root}/js/modules/${response.js}`, render);
			}
			
			function wait(fn){
				for(let i in map) if(map[i] === false) return;
				
				clearInterval(depend);
				fn();
			}
			
			function render(){
				
				dark.object.find('.dark_content').addClass('pop');
				$module.animate({
					opacity: 1,
				}, 100);
				
				// Add dark handle to module
				modules[name].dark = dark;
				
				// Start module with supplied data (optional)
				return start(name, data);
			}
		});
	}
	
	function loadBehavior(name, callback){
		if(behaviors[name]) return callback ? callback() : true;
		
		$.getScript(`${environment.root}/js/behaviors/${name}.js`) // <--- this does NOT use cache
		.done(callback);
	}
	
	function start(name, data){
		if(!modules[name]) return undefined;
		if(modules[name].status) return true;
		
		modules[name].run(getContext(name, data));
		
		return modules[name].status = true;
	}
	
	function stop(name){
		if(!modules[name]) return undefined;
		
		if(modules[name].dark) modules[name].dark.remove();
		modules[name].status = false;
		modules[name].stop();
		return true;
	}
	
	function getContext(name, data){
		var $element = Paperwork.body.find(`[data-module="${name}"]`);
		
		var url = (function(){
			var search = location.search.substring(1);
			
			if(!search) return {};
			
			return JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g,'":"') + '"}',
			function(key, value) {
				return key === "" ? value : decodeURIComponent(value);
			});
		})();
		
		if(!data) data = {};
		
		return {
			name: name,
			data: data,
			url: url,
			element: $element,
			require: require,
			load: loadModule,
			use: function(behavior, options){
				return use(name, behavior, options);
			},
			stop: function(){
				return stop(name);
			},
		};
	}
	
	function use(origin, name, options){
		var context = getContext(origin);
		
		if(!options) options = {};
		delete context.use;
		delete context.load;
		
		if(behaviors[name]) return behaviors[name](context, options);
		
		loadBehavior(name, function(){
			return behaviors[name](context, options);
		});
	}
	
	function require(name){
		if(!services[name]) return console.warn(`Service ${name} is undefined`);
		
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