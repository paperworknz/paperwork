Form.prototype.copy = function(form, templates){
	var a= this,
		form_id= form.attr('data-formid'),
		formcontent = form.find($(a.p.get('form-content', form)));
	
	// Darken page, then show the concern
	a.dark(form); // Turn off interaction
	
	var d = Paperwork.dark();
	var dark_container = d.object;
	var fade = d.object.find('.dark_object');
	
	// Copy content
	fade.after(`
		<div class="copy-content">
			<div class="copy-parent wrap">
				<div class="container-top">
					<div class="h4 title centered ">
						Use template:
					</div>
				</div>
				<div class="container-mid">
				</div>
			</div>
		</div>
	`);
	
	$.each(templates, function(a,b){
		$('.copy-content .copy-parent .container-mid').append(`
			<div class="new-template" data-templateid="${a}">
				${b}
			</div>
		`);
	});
	
	$('.copy-content .copy-parent').append(`
		<div class="container wrap">
			<button copy-cancel class="button blue right">
				CANCEL
			</button>
		</div>
	`);
	
	$('.copy-content').css({
		top: (($(window).height() / 2)) - ($('.copy-content').height() / 2),
	});
	
	// Fade in
	d.run(function(){
		$('.copy-content').animate({
			opacity: 1,
		}, 100);
	});
	
	// ********* FORMDOM ********* //
	
	// Listen to template selection
	$('.copy-content .new-template').on('click', function(){
		var data = {
			client: a.p.get('client', form),
			jobd: a.p.get('jobd', form),
			content: a.map[form_id],
		};
		var template_name = $(this).html(),
			template_id = $(this).attr('data-templateid');
		
		d.remove(function(){
			$('.copy-content').off().unbind().remove();
			a.refresh(form);
			a.update(form);
		});
		
		a.post({
			url: environment.root+'/post/form',
			template_name: template_name,
			template_id: template_id,
			client_id: environment.client_id,
			job_id: environment.job_id,
			job_number: environment.job_number,
		}, function(new_form){
			
			var new_form_id = new_form.attr('data-formid');
			
			// Append item to DOM
			$.each(a.map[form_id].items, function(y,z){
				a.p.append(new_form, {
					itemID: z.itemID,
					item: z.item,
					quantity: z.quantity,
					price: z.price
				});
			});
			
			// Update and create map
			a.construct(new_form);
			
			// Clone margins
			$.each(a.map[new_form_id].items, function(y,z){
				a.map[new_form_id].items[y].margin = a.map[form_id].items[y].margin;
			});
			
			// Populate
			a.p.set('client', new_form, data.client);
			a.p.set('jobd', new_form, data.jobd);
			
			// Save
			a.put({
				url: environment.root+'/put/form',
				id: new_form_id,
			});
		});
	});
	
	// Listen to cancel
	$('.copy-content [copy-cancel]').on('click', function(){
		a.update(form);
		$('.copy-content').fadeOut(100, function(){
			d.remove(function(){
				$('.copy-content').off().unbind().remove();
				a.refresh(form);
				a.update(form);
			});
		});
	});
	
	// Cancel on click out of focus
	fade.on('click', function(){
		a.update(form);
		$('.copy-content').fadeOut(100, function(){
			d.remove(function(){
				$('.copy-content').off().unbind().remove();
				a.refresh(form);
				a.update(form);
			});
		});
	});
	
};