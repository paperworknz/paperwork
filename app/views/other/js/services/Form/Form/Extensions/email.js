Form.prototype.email = function(form){
	var a= this,
		form_id= form.attr('data-formid'),
		formcontent= form.find($(a.p.get('form-content', form))),
		signature,
		password,
		wrong = 0;
	
	// Password from localStorage
	password = localStorage && localStorage.ep != undefined ? localStorage.ep : null;
	
	// Signature
	signature = $('.email-signature-raw').html();
	
	// Darken page, then show the concern
	a.dark(form); // Turn off interaction
	
	var d = Paperwork.dark();
	var dark_container = d.object;
	var fade = d.object.find('.dark_object');
	
	// Email content
	fade.after(`
		<div class="email-content">
			<div class="email-parent wrapper">
				<input class="email-email" type="text" style="width:50%" value="${environment.client_email}" placeholder="Email Address" required />
				<input class="email-subject" type="text" placeholder="Subject Line" required />
				<div class="email-body" style="padding:4px;width:100%;height:300px;border:1px solid #ccc;overflow-y:auto" contenteditable>
					<br>
					${signature}
				</div>
				<i>PDF attached</i>
				<div class="wrapper">
					<button email-send class="wolfe-btn pull-right">SEND</button>
					<button email-cancel class="wolfe-btn blue pull-right" style="margin-right:5px">CANCEL</button>
					<input class="email-password pull-right" type="password" name="password" 
						style="height:37px;line-height:37px;width:25%;margin-right:5px" placeholder="Email Password" required />
				</div>
			</div>
		</div>
	`);
	
	// Email content css
	$('.email-content').css({
		top: (($(window).height() / 2)) - ($('.email-content').height() / 2),
	});
	
	// Inject password
	$('.email-content input[name=password]').val(password);
	
	// Fade in
	d.run(function(){
		$('.email-content').animate({
			'opacity': 1
		}, 100);
	});
	
	
	// ********* FORMDOM ********* //
	
	// Listen to send
	$('.email-content [email-send]').on('click', function(){
		
		$('.email-content .email-parent').addClass('no-click');
		$('.email-content .email-parent').css('opacity', '0.5');
		
		$('.email-content .email-parent').append(`
			<div style="width:200px;height:123px;position:absolute;left:0;right:0;top:0;bottom:0;margin:auto;">
				<img src="${environment.root}/css/app/media/plane.gif" width="200px" />
			</div>
		`);
		
		var address = $('.email-email').val(),
			subject = $('.email-subject').val(),
			body = $('.email-body').html(),
			password = $('.email-password').val(),
			pdf_name,
			pdf_html;
		
		// Get PDF HTML
		a.pdf($(a.s).find(a.form), function(name, data){
			pdf_name = name;
			pdf_html = data;
		});
		
		// Post PDF and Email
		$.post(environment.root+'/post/email', {
			job_number: environment.job_number,
			name: pdf_name,
			html: pdf_html,
			client_name: environment.client_name,
			address: address,
			subject: subject,
			body: body,
			password: password,
		}).done(function(response){
			if(response == 'OK'){
				
				$('.email-content .email-parent').css('opacity', '0');
				$('.email-content').append(`
					<div style="width:95px;position:absolute;left:0;right:0;top:165px;margin:auto;">
						<video autoplay>
							<source src="${environment.root}/css/app/media/success.webm" type="video/webm">
						</video>
					</div>
				`);
				
				setTimeout(function(){
					$('.email-content').fadeOut(100, function(){
						d.remove(function(){
							$('.email-content').off().unbind().remove();
							a.refresh(form);
							a.update(form);
						});
					});
				}, 1500);
				
				// Cache password
				localStorage.ep = password;
				
			}else if(response == 'Password'){
				
				let message;
				
				if(wrong > 1){
					message = `Do you need to <a href="${environment.root}/settings" target="_blank">update your password</a> in Paperwork?`;
				}else{
					message = 'Wrong password';
				}
				
				$('.email-content .email-parent').removeClass('no-click');
				$('.email-content .email-parent').css('opacity', '1');
				$('.email-content .wait').remove();
				$('.email-content [wrong-password]').remove();
				$('.email-content .email-password').after(`
					<div wrong-password style="color:red;line-height:37px;padding-right:5px" class="pull-right">
						${message}
					<div>
				`);
				wrong++;
			}else{
				$('.email-content .email-parent').css('opacity', '0');
				$('.email-content').append(`
					<div style="text-align:center;position:absolute;left:0;right:0;top:78px;margin:auto;">
						There was a problem sending this email.<br>
						Please make sure your email settings are correct, otherwise email hello@paperwork.nz for support.
					</div>
				`);
			}
		}).fail(function(){
			$('.email-content .email-parent').css('opacity', '0');
			$('.email-content').append(`
				<div style="text-align:center;position:absolute;left:0;right:0;top:78px;margin:auto;">
					There was a problem sending this email.<br>
					Please make sure your email settings are correct, otherwise email hello@paperwork.nz for support.
				</div>
			`);
		});
		
	});
	
	// Listen to cancel
	$('.email-content [email-cancel]').on('click', function(){
		$('.email-content').fadeOut(100, function(){
			d.remove(function(){
				$('.email-content').off().unbind().remove();
				a.refresh(form);
				a.update(form);
			});
		});
	});
	
	// Cancel on click out of focus
	fade.on('click', function(){
		if($('.email-subject').val() == '' && $('.email-body').html().length === 0){
			$('.email-content').fadeOut(100, function(){
				d.remove(function(){
					$('.email-content').off().unbind().remove();
					a.refresh(form);
					a.update(form);
				});
			});
		}
	});
	
};