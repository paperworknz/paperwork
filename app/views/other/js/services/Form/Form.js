var Form = function(){
	var a = this;
	
	// Depends on
	a.pw= Paperwork;
	a.tab= tab;
	a.p= new Painter;
	
	// Properties
	a.s= '.'+a.tab.activeObj; // Div that contains the active form
	a.form= '[form-blob]'; // Div that contains a form blob
	a.map= {}; // Material on form
	
	// __construct()
	$.get(environment.root+'/get/inventory', function(data){
		$.get(environment.root+'/get/form/'+environment.job_id, function(items){
			var src = [],
				map = JSON.parse(items);
			
			// Add margin property to each item in json
			$.each(map, function(a, b){
				$.each(b.items, function(c,d){
					if(d.margin == undefined || d.margin == 0){
						map[a].items[c].margin = '1';
					}
				});
			});
			
			a.inv = JSON.parse(data); // Inventory
			$.each(a.inv, function(a,b){src.push(a)}); // Typeahead array of inventory
			a.typeahead= new Typeahead(src);
			
			$(a.form).each(function(){
				var form = $(this),
					form_id= form.attr('data-formid');
				
				map[form_id] != undefined || map[form_id] != null ? a.map[form_id] = map[form_id] :	a.crawl(form);
				a.construct(form);
			});
		});
	});
};

//-> parts/Core/append.js
//-> parts/Core/construct.js
//-> parts/Core/crawl.js
//-> parts/Core/dark.js
//-> parts/Core/populate.js
//-> parts/Core/refresh.js
//-> parts/Core/strip.js
//-> parts/Core/update.js
//-> parts/Core/margin.js

//-> parts/Extensions/copy.js
//-> parts/Extensions/email.js
//-> parts/Extensions/PDF.js

//-> parts/REST/post.js
//-> parts/REST/put.js
//-> parts/REST/delete.js