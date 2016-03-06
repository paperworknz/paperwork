Form.prototype.delete = function(data, callback){
	var a = this;
	
	// Delete form
	if(data.url != undefined && data.formID != undefined){
		$.post(data.url, {
			formID: data.formID
		}).done(function(data){
			if(data != '0'){
				if(callback != undefined) callback(true); // Callback
			}else{
				if(callback != undefined) callback(false); // Callback
				console.log('Form delete failed with Slim 0');
			}
		}).fail(function(){
			if(callback != undefined) callback(false); // Callback
			console.log('Internal Server Error');
		});
	}
};