Form.prototype.post = function(data, callback){
	var a= this;
	
	// Post form
	if(data.url != undefined && data.templateID != undefined &&
		data.clientID != undefined && data.jobID != undefined){
		$.post(data.url, {
			templateID:	data.templateID,
			clientID:	data.clientID,
			jobID:		data.jobID
		}).done(function(json){
			var json	= JSON.parse(json),
				obj		= a.tab.objParent,
				objID	= Number($(obj).find('['+a.tab.heir+']').attr(a.tab.objhook));
			
			// Create new obj
			$(obj).find('['+a.tab.heir+']').before('<div '+a.tab.objhook+'="'+objID+'" class="'+a.tab.obj+' h">'+json.html+'</div>');
			$(obj).find('['+a.tab.heir+']').replaceWith('<div '+a.tab.objhook+'="'+(objID + 1)+'" '+a.tab.heir+' hidden></div>');
			
			// Update data-formid on form-blob
			$('['+a.tab.objhook+'="'+objID+'"]').find('[form-blob]').attr('data-formid', json.formID);
			
			// Update a.map
			var form = $('[data-formid="'+json.formID+'"]');
			a.crawl(form);
			
			// Create new tab
			a.tab.append(data.templateName, function(){
				a.populate(form, {
					jobID: data.jobID,
					date: json.date,
					client: json.client,
				});
				a.put({
					url: environment.root+'/put/form',
					formID: json.formID,
				}, function(data){
					console.log(data);
					a.construct(form);
					callback(form);
				});
			});
		}).fail(function(){
			if(callback != undefined) callback(false); // Callback
			console.log('Internal Server Error');
		});
	}
};