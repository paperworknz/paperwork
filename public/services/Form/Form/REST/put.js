Form.prototype.put = function(data, callback){
	var a= this,
		formID= data.formID,
		form= $('[data-formid="'+formID+'"]'),
		save= form.clone();
	
	// Flush html items
	a.p.do('flush-items', save);
	var html= a.strip(save); // Remove interactive tools, returns html
	
	// Put form
	if(data.url != undefined && formID != undefined){
		$.post(data.url, {
			formID: formID, // User defined or current
			html: html,
			json: JSON.stringify(a.map[formID]),
		}).done(function(){
			if(data != '0'){
				//a.refresh(form);
				//document.cookie = 'autosave.'+$(a.s).attr('data-formid')+'=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
				if(callback != undefined) callback(true); // Callback
			}else{
				if(callback != undefined) callback(false); // Callback
				console.log('Form put failed with Slim 0');
			}
		}).fail(function(){
			if(callback != undefined) callback(false); // Callback
			console.log('Internal Server Error');
		});
	}else{
		console.log('URL or formID not supplied, form not saved.');
	}
};