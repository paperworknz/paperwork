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
		$.get(environment.root+'/get/form/'+environment.jobID, function(items){
			var src = [],
				map = JSON.parse(items);
			
			a.inv = JSON.parse(data); // Inventory
			$.each(a.inv, function(a,b){src.push(a)}); // Typeahead array of inventory
			a.typeahead= new Typeahead(src);
			
			$(a.form).each(function(){
				var form = $(this),
					formID= form.attr('data-formid');
				
				map[formID] != undefined || map[formID] != null ? a.map[formID] = map[formID] :	a.crawl(form);
				a.construct(form);
			});
		});
	});
};