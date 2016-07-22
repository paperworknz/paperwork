Form.prototype.post = function(data, callback){
	var a= this;
	
	// Post form
	if(data.url != undefined && data.template_id != undefined &&
		data.client_id != undefined && data.job_id != undefined && data.job_number != undefined){
		$.post(data.url, {
			template_id: data.template_id,
			client_id: data.client_id,
			job_id: data.job_id
		}).done(function(json){
			var json	= JSON.parse(json),
				obj		= '[data-type="obj-container"]',
				objID	= Number($(obj).find('[data-type="obj"]').last().prev().data('id')),
				form_id	= json.id;
			
			// Create new obj
			$(obj).find(`[data-id="${objID}"]`).after(`
				<div data-type="obj" data-id="${objID + 1}" class="tabobj">
					${json.html}
				</div>
			`);
			
			// Update data-formid on form-blob
			$(obj).find(`[data-id="${objID + 1}"]`).find('[form-blob]').attr('data-formid', form_id);
			
			// Update a.map
			var form = $(`[data-formid="${form_id}"]`);
			a.crawl(form);
			
			// Create new tab
			var tab_c = $('[data-type="tab-container"]');
			
			tab_c.find('.tab').last().prev().after(`
				<li data-type="tab" data-id="${objID + 1}" class="tab">${data.template_name}</li>
			`);
			
			Paperwork.send('tab.job.activate', Number(objID + 1));
			
			a.populate(form, {
				job_number: data.job_number,
				date: json.date,
				client: json.client,
			});
			
			a.put({
				url: environment.root+'/put/form',
				id: form_id,
			}, function(){
				a.construct(form);
				callback(form);
			});
			
		}).fail(function(){
			if(callback != undefined) callback(false); // Callback
			console.log('Internal Server Error');
		});
	}
};