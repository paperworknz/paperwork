Form.prototype.email = function(form){
	var a= this,
		form_id= form.attr('data-formid'),
		formcontent = form.find($(a.p.get('form-content', form)));
	
	// Darken page, then show the concern
	a.dark(form); // Turn off interaction 
	
	$('#content').after('<div email></div>'); // Append copy container
	$('[email]').append('<div fade style="width:10000px;height:10000px;background-color:black;opacity:0.0;position:fixed;top:0;z-index:2;overflow:hidden;" disable></div>');
	$('[fade]').after('<div email-content></div>');
	$('[email-content]').css({
		position:'absolute',
		'z-index':999,
		left:0,
		right:0,
		marginLeft:'auto',
		marginRight:'auto',
		width:'710px',
		'background-color':'white',
		border:'none',
		'min-height':'50px',
		opacity: '0.00'
	});
	
	var signature = $('.email-signature-raw').html();
	
	$('[email-content]').html(
		'<style>.email-parent input {display:block;width:100%;border:1px solid #ccc;margin-bottom:10px;}</style>'+
		'<div email-parent class="email-parent wrapper">'+
			'<input class="email-email" type="text" style="width:50%" value="'+environment.client_email+'" placeholder="Email Address" required />'+
			'<input class="email-subject" type="text" placeholder="Subject Line" required />'+
			'<div class="email-body" style="padding:4px;width:100%;height:300px;border:1px solid #ccc;overflow-y:auto" contenteditable>'+
			'<br>'+
			signature+
			'</div>'+
			'<i>PDF attached</i>'+
		'</div>'
	);
	
	$('[email-parent]').css({
		margin:'10px'
	});
	
	$('[email-parent]').append(
		'<div class="wrapper">'+
			'<button email-send class="wolfe-btn pull-right">SEND</button>'+
			'<button email-cancel class="wolfe-btn blue pull-right" style="margin-right:5px">CANCEL</button>'+
			'<input class="email-password pull-right" type="password" name="password" style="height:37px;line-height:37px;width:25%;margin-right:5px" placeholder="Email Password" required />'+
		'</div>'
	);
	
	$('[email-content]').css({
		top:(($(window).height() / 2)) - ($('[email-content]').height() / 2),
	});
	
	// Fade in
	$('[fade]').animate({'opacity':0.66}, 150, function(){
		$('[email] [email-content]').animate({'opacity':1}, 100);
	});
	
	
	// ********* FORMDOM ********* //
	
	// Listen to send
	$('[email] [email-send]').on('click', function(){
		
		$('[email] [email-parent]').addClass('no-click');
		$('[email] [email-parent]').css('opacity', '0.5');
		
		$('[email] [email-parent]').append(
			'<div class="wait la-ball-fall" style="width:50px!important;position:absolute;left:0;right:0;top:120px;margin:auto;">'+
				'<div style="background-color:#bbb"></div><div style="background-color:#bbb"></div><div style="background-color:#bbb"></div>'+
			'</div>'
		);
		
		var address = $('.email-email').val(),
			subject = $('.email-subject').val(),
			body = $('.email-body').html(),
			password = $('.email-password').val(),
			pdf = '';
		
		// Get PDF HTML
		a.pdf($(a.s).find('[form-blob]'), function(data){
			pdf = data;
		});
		
		// Make PDF name
		var tabID = $('.'+a.tab.activeTab).attr(a.tab.tabhook),
			tname = $('.'+a.tab.activeTab).html(),
			pdf_name = tabID+'-'+tname.toLowerCase();
		
		// Post PDF and Email
		$.post(environment.root+'/post/email', {
			job_number: environment.job_number,
			file_name: pdf_name,
			html: pdf,
			client_name: environment.client_name,
			address: address,
			subject: subject,
			body: body,
			password: password,
		}).done(function(response){
			if(response == 'OK'){
				$('[email] [email-parent]').css('opacity', '0');
				$('[email] [email-content]').append(
					'<div style="width:95px;position:absolute;left:0;right:0;top:165px;margin:auto;">'+
						'<video autoplay>'+
							'<source src="'+environment.root+'/css/app/media/success.webm" type="video/webm">'+
						'</video>'+
					'</div>'
				);
				setTimeout(function(){
					$('[email] [email-content]').fadeOut(100, function(){
						$('[fade]').fadeOut(150, function(){
							$('[email]').off().unbind().remove();
							a.refresh(form);
							a.update(form);
						});
					});
				}, 1500);
			}else if(response == 'Password'){
				$('[email] [email-parent]').removeClass('no-click');
				$('[email] [email-parent]').css('opacity', '1');
				$('[email] .wait').remove();
				$('[email] .email-password').after(
					'<div style="color:red;line-height:37px;padding-right:5px" class="pull-right">'+
					'Wrong password'+
					'<div>'
				);
			}else{
				$('[email] [email-parent]').css('opacity', '0');
				$('[email] [email-content]').append(
					'<div style="text-align:center;position:absolute;left:0;right:0;top:78px;margin:auto;">'+
						'There was a problem sending this email.<br>'+
						'Please make sure your email settings are correct, otherwise email hello@paperwork.nz for support.'+
					'</div>'
				);
			}
		}).fail(function(){
			$('[email] [email-parent]').css('opacity', '0');
			$('[email] [email-content]').append(
				'<div style="text-align:center;position:absolute;left:0;right:0;top:78px;margin:auto;">'+
					'There was a problem sending this email.<br>'+
					'Please make sure your email settings are correct, otherwise email hello@paperwork.nz for support.'+
				'</div>'
			);
		});
		
	});
	
	// Listen to cancel
	$('[email] [email-cancel]').on('click', function(){
		$('[email] [email-content]').fadeOut(100, function(){
			$('[fade]').fadeOut(150, function(){
				$('[email]').off().unbind().remove();
				a.refresh(form);
				a.update(form);
			});
		});
	});
	
	// Cancel on click out of focus
	$('[fade]').on('click', function(){
		if($('.email-subject').val() == '' && $('.email-body').html().length === 0){
			$('[email] [email-content]').fadeOut(100, function(){
				$('[fade]').fadeOut(150, function(){
					$('[email]').off().unbind().remove();
					a.refresh(form);
					a.update(form);
				});
			});
		}
	});
	
};