Form.prototype.copy = function(form){
	var a= this,
		form_id= form.attr('data-formid');
	
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
				template_name= 'Invoice';
			
			if(input == 1){
				template_name = 'Quote';
			}else if(input == 2){
				template_name = 'Invoice';
			}else{
				template_name = 'Invoice';
			}
			
			var data = {
				client: a.p.get('client', form),
				jobd: a.p.get('jobd', form),
				content: a.map[form_id],
			};
			
			pw.wait(button);
			a.post({
				url: environment.root+'/post/form',
				template_id: input,
				template_name: template_name,
				client_id: environment.client_id,
				job_id: environment.job_id,
			}, function(new_form){
				
				// Append item to DOM
				$.each(a.map[form_id].items, function(y,z){
					a.p.append(new_form, {
						itemID: z.itemID,
						item: z.item,
						quantity: z.quantity,
						price: z.price
					});
				});
				
				// Populate new form
				var new_form_id = new_form.attr('data-formid');
				a.p.set('client', new_form, data.client);
				a.p.set('jobd', new_form, data.jobd);
				a.construct(new_form);
				a.put({
					url: environment.root+'/put/form',
					id: new_form_id,
				}, function(){
					pw.ready(button, 'COPY');
				});
			});
		}
	});
};