Form.prototype.email = function(form){
	var a= this,
		form_id= form.attr('data-formid'),
		formcontent= form.find($(a.p.get('form-content', form))),
		signature,
		password,
		wrong = 0;
	
	// Password from localStorage
	password = localStorage && localStorage.ep != undefined ? localStorage.ep : null;
	
	// Darken page, then show the concern
	a.dark(form); // Turn off interaction 
	
	// Container
	$('#content').after(`
		<div email>
		</div>
	`);
	
	// Fade
	$('[email]').append(`
		<div fade style="width:10000px;height:10000px;background-color:black;opacity:0.0;position:fixed;top:0;z-index:2;overflow:hidden;" disable>
		</div>
	`);
	
	// Email content
	$('[fade]').after(`
		<div email-content>
		</div>
	`);
	$('[email-content]').css({
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
	
	// Signature
	signature = $('.email-signature-raw').html();
	
	$('[email-content]').html(`
		<style>
			.email-parent input {display:block;width:100%;border:1px solid #ccc;margin-bottom:10px;}
		</style>
		<div email-parent class="email-parent wrapper">
			<input class="email-email" type="text" style="width:50%" value="${environment.client_email}" placeholder="Email Address" required />
			<input class="email-subject" type="text" placeholder="Subject Line" required />
			<div class="email-body" style="padding:4px;width:100%;height:300px;border:1px solid #ccc;overflow-y:auto" contenteditable>
				<br>
				${signature}
			</div>
			<i>PDF attached</i>
		</div>
	`);
	
	$('[email-parent]').css({
		margin: '10px',
	});
	
	$('[email-parent]').append(`
		<div class="wrapper">
			<button email-send class="wolfe-btn pull-right">SEND</button>
			<button email-cancel class="wolfe-btn blue pull-right" style="margin-right:5px">CANCEL</button>
			<input class="email-password pull-right" type="password" name="password" 
				style="height:37px;line-height:37px;width:25%;margin-right:5px" placeholder="Email Password" required />
		</div>
	`);
	
	// Inject password
	$('[email] input[name=password]').val(password);
	
	$('[email-content]').css({
		top: (($(window).height() / 2)) - ($('[email-content]').height() / 2),
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
		
		$('[email] [email-parent]').append(`
			<div style="width:200px;height:123px;position:absolute;left:0;right:0;top:0;bottom:0;margin:auto;">
				<img src="${environment.root}/css/app/media/plane.gif" style="width:200px;" />
			</div>
		`);
		
		var address = $('.email-email').val(),
			subject = $('.email-subject').val(),
			body = $('.email-body').html(),
			password = $('.email-password').val(),
			pdf_name,
			pdf_html;
		
		// Get PDF HTML
		a.pdf($(a.s).find('[form-blob]'), function(name, data){
			pdf_name = name;
			pdf_html = data;
		});
		
		// Post PDF and Email
		$.post(environment.root+'/post/email', {
			job_number: environment.job_number,
			file_name: pdf_name,
			html: pdf_html,
			client_name: environment.client_name,
			address: address,
			subject: subject,
			body: body,
			password: password,
		}).done(function(response){
			if(response == 'OK'){
				
				$('[email] [email-parent]').css('opacity', '0');
				$('[email] [email-content]').append(`
					<div style="width:95px;position:absolute;left:0;right:0;top:165px;margin:auto;">
						<video autoplay>
							<source src="${environment.root}/css/app/media/success.webm" type="video/webm">
						</video>
					</div>
				`);
				
				setTimeout(function(){
					$('[email] [email-content]').fadeOut(100, function(){
						$('[fade]').fadeOut(150, function(){
							$('[email]').off().unbind().remove();
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
				
				$('[email] [email-parent]').removeClass('no-click');
				$('[email] [email-parent]').css('opacity', '1');
				$('[email] .wait').remove();
				$('[email] [wrong-password]').remove();
				$('[email] .email-password').after(`
					<div wrong-password style="color:red;line-height:37px;padding-right:5px" class="pull-right">
						${message}
					<div>
				`);
				wrong++;
			}else{
				$('[email] [email-parent]').css('opacity', '0');
				$('[email] [email-content]').append(`
					<div style="text-align:center;position:absolute;left:0;right:0;top:78px;margin:auto;">
						There was a problem sending this email.<br>
						Please make sure your email settings are correct, otherwise email hello@paperwork.nz for support.
					</div>
				`);
			}
		}).fail(function(){
			$('[email] [email-parent]').css('opacity', '0');
			$('[email] [email-content]').append(`
				<div style="text-align:center;position:absolute;left:0;right:0;top:78px;margin:auto;">
					There was a problem sending this email.<br>
					Please make sure your email settings are correct, otherwise email hello@paperwork.nz for support.
				</div>
			`);
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