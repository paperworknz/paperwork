var Typeahead = function(src, params, env){
	this.src = src;
	if(params != undefined){ this.params = params;
	}else{this.params = {
			hint: true,
			highlight: true,
			minLength: 1
		};
	}
	if(env != undefined){ this.env = env;
	}else{ this.env = {
			source: substringMatcher(this.src)
		};
	}
};

Typeahead.prototype.run = function(ele){
	var a = this;
	$(ele).find('.typeahead').typeahead(a.params, a.env);
};