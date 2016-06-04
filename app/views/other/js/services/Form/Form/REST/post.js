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
				obj		= a.tab.objParent,
				objID	= Number($(obj).find(`[${a.tab.heir}]`).attr(a.tab.objhook)),
				form_id	= json.id;
			
			// Create new obj
			$(obj).find(`[${a.tab.heir}]`).before(`
				<div ${a.tab.objhook}="${objID}" class="${a.tab.obj} h">
					${json.html}
				</div>
			`);
			
			$(obj).find(`[${a.tab.heir}]`).replaceWith(`
				<div ${a.tab.objhook}="${(objID + 1)}" ${a.tab.heir$} hidden>
				</div>
			`);
			
			// Update data-formid on form-blob
			$(`[${a.tab.objhook}="${objID}"]`).find('[form-blob]').attr('data-formid', form_id);
			
			// Update a.map
			var form = $(`[data-formid="${form_id}"]`);
			a.crawl(form);
			
			// Create new tab
			a.tab.append(data.template_name, function(tabID){
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
			});
		}).fail(function(){
			if(callback != undefined) callback(false); // Callback
			console.log('Internal Server Error');
		});
	}
};