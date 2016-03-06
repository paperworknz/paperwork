Form.prototype.copy = function(form){
	var a= this,
		formID= form.attr('data-formid');
	
	swal({
		title: 'Choose your template',
		text: '1 for Quote, 2 for Invoice',
		type: 'input',
		inputPlaceholder: 'Write something',
		showCancelButton: true,
		html: true,
	}, function(e){
		if(e != false){ // User hasn't clicked cancel
			var button= $(this),
				input= e,
				templateName= 'Invoice';
			
			if(input == 1){
				templateName = 'Quote';
			}else if(input == 2){
				templateName = 'Invoice';
			}else{
				templateName = 'Invoice';
			}
			
			var data = {
				client: a.p.get('client', form),
				jobd: a.p.get('jobd', form),
				content: a.map[formID],
			};
			
			pw.wait(button);
			a.post({
				url: environment.root+'/post/form',
				templateID: input,
				templateName: templateName,
				clientID: environment.clientID,
				jobID: environment.jobID,
			}, function(newForm){
				
				// Append item to DOM
				$.each(a.map[formID].items, function(y,z){
					a.p.append(newForm, {
						itemID: z.itemID,
						item: z.item,
						quantity: z.quantity,
						price: z.price
					});
				});
				
				// Populate new form
				var newFormID = newForm.attr('data-formid');
				a.p.set('client', newForm, data.client);
				a.p.set('jobd', newForm, data.jobd);
				a.construct(newForm);
				a.put({
					url: environment.root+'/put/form',
					formID: newFormID,
				}, function(){
					pw.ready(button, 'COPY');
				});
			});
		}
	});
};