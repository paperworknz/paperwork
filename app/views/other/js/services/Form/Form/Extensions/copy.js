Form.prototype.copy = function(form, templates){
	var a= this,
		form_id= form.attr('data-formid'),
		formcontent = form.find($(a.p.get('form-content', form)));
	
	// Darken page, then show the concern
	a.dark(form); // Turn off interaction 
	
	// Container
	$('#content').after(`
		<div copy>
		</div>
	`);
	
	// Fade
	$('[copy]').append(`
		<div fade style="width:10000px;height:10000px;background-color:black;opacity:0.0;position:fixed;top:0;z-index:2;overflow:hidden;" disable>
		</div>
	`);
	
	// Copy content
	$('[fade]').after(`
		<div copy-content>
		</div>
	`);
	$('[copy-content]').css({
		position: 'absolute',
		zIndex: 999,
		left: 0,
		right: 0,
		marginLeft: 'auto',
		marginRight: 'auto',
		width: '710px',
		backgroundColor: 'white',
		border: 'none',
		minHeight: '50px',
		opacity: '0.00',
	});
	
	$('[copy-content]').html(`
		<div copy-parent class="wrapper">
			<div style="text-align:center;font-size:20px;line-height:20px;padding:15px 0px">
				Use template:
			</div>
		</div>
	`);
	$('[copy-parent]').css({
		margin: '10px',
	});
	
	$.each(templates, function(a,b){
		$('[copy-parent]').append(`
			<div class="new-template" data-templateid="${a}">
				${b}
			</div>
		`);
	});
	
	$('[copy-parent]').append('<button copy-cancel class="wolfe-btn blue pull-right" style="margin-right:5px">CANCEL</button>');
	
	$('[copy-content]').css({
		top: (($(window).height() / 2)) - ($('[copy-content]').height() / 2),
	});
	
	// Fade in 
	$('[fade]').animate({'opacity':0.66}, 150, function(){
		$('[copy] [copy-content]').animate({
			opacity: 1,
		}, 100);
	});
	
	// ********* FORMDOM ********* //
	
	// Listen to template selection
	$('[copy] .new-template').on('click', function(){
		var data = {
			client: a.p.get('client', form),
			jobd: a.p.get('jobd', form),
			content: a.map[form_id],
		};
		var template_name = $(this).html(),
			template_id = $(this).attr('data-templateid');
		
		$('[fade]').fadeOut(150, function(){
			$('[copy]').off().unbind().remove();
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
			});
		});
	});
	
	// Listen to cancel
	$('[copy] [copy-cancel]').on('click', function(){
		a.update(form);
		$('[copy] [copy-content]').fadeOut(100, function(){
			$('[fade]').fadeOut(150, function(){
				$('[copy]').off().unbind().remove();
				a.refresh(form);
				a.update(form);
			});
		});
	});
	
	// Cancel on click out of focus
	$('[fade]').on('click', function(){
		a.update(form);
		$('[copy] [copy-content]').fadeOut(100, function(){
			$('[fade]').fadeOut(150, function(){
				$('[copy]').off().unbind().remove();
				a.refresh(form);
				a.update(form);
			});
		});
	});
	
};