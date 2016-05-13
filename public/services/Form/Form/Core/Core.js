var Form = function(){
	var a = this;
	
	// Depends on
	a.pw= pw;
	a.tab= tab;
	a.p= new Painter;
	
	// Properties
	a.s= '.'+a.tab.activeObj; // Div that contains the active form
	a.form= '[form-blob]'; // Div that contains a form blob
	a.map= {}; // Material on form
	
	// __construct()
	$.get(environment.root+'/get/inv', function(data){
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