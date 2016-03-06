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
				map = JSON.parse(items),
				flag = true; // True for Zamorak
			
			a.inv = JSON.parse(data); // Inventory
			$.each(a.inv, function(a,b){src.push(a)}); // Typeahead array of inventory
			a.typeahead= new Typeahead(src);
			
			$(a.form).each(function(){
				var form = $(this),
					formID= form.attr('data-formid');
				
				if(map[formID] != undefined || map[formID] != null){
					a.map[formID] = map[formID];
					flag = false; // JSON exists, so it's Armadyl
				}else{
					a.crawl(form);
				}
				
				if(!flag){ // If armadyl
					a.construct(form);
				}
			});
			
			if(a.p.is == 'Zamorak'){
				if(flag){ // json hasn't been saved before
					$.each(a.map, function(key, pair){ // Save maps
						a.put({
							url: environment.root+'/put/form-json',
							formID: key,
							json: JSON.stringify(pair)
						});
					});
				}
				
				if(flag && !$.isEmptyObject(a.map)){ // New map, existing forms
					location.reload();
				}
				
				if($.isEmptyObject(a.map)){ // No forms, upgrade to army
					$.post(environment.root+'/post/army', {
						jobID: environment.jobID
					}, function(){
						location.reload();
					});
				}
				
				if(!flag){
					$(a.form).each(function(){
						var form= $(this),
							formID= form.attr('data-formid');
						a.put({
							url: environment.root+'/put/form',
							formID: formID,
						});
					});
					
					$.post(environment.root+'/post/army', {
						jobID: environment.jobID
					}, function(){
						location.reload();
					});
				}
			}
		});
	});
};