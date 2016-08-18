var Paperwork = (function(){
	
	const $body = $('body');
	const events = {};
	var validationNodes = {};
	
	preventBackspace(); // preventBackspace.js
	overrideLinks(); // goto.js
	applyWaitToButtons(); // button.js
	formFlow(); // formFlow.js
	validateDOM(); // validation.js
	
	// Append notification container to body
	if(!$body.find('.pw-notification').length) $body.append(`<div class="pw-notification" data-module="notification"></div>`);
	
function preventBackspace(){
	let exclusions = 'input, select, textarea, [contenteditable]';
	
	$body.on('keydown', function(event){
		let code = event.keyCode || event.which,
			$target = $(event.target);
		
		if(code === 8 && !$target.is(exclusions)) event.preventDefault();
	});
}
function formFlow(){
	let elements = 'input[type=text], input[type=email], input[type=password]';
	
	$body.on('keydown', elements, function(event){
		let code = event.keyCode || event.which,
			$next = $(`:input:eq(${($(':input').index(this) + 1)})`);
		
		if(code === 13){
			$next.focus();
			if(!$next.is('button')) event.preventDefault();
		}
	});
}
	
function on(event, fn){
	events[event] = events[event] || [];
	events[event].push(fn);
}

function off(event, fn){
	// Remove event from events object
	if(events[event]) for(let i = 0; i < events[event].length; i++) if(events[event][i] === fn) events[event].splice(i, 1);
}

function send(event, response){
	// Fire all functions in event object that match event
	if(events[event]) events[event].forEach(function(fn){ fn(response); });
}
function random(length, type){
	let characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
		result = '';
	
	if(type == undefined) type = 'string';
	
	switch(type){
		case 'lower':
			characters = 'abcdefghijklmnopqrstuvwxyz';
			break;
		case 'upper':
			characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
			break
		case 'number':
			characters = '0123456789';
			break;
	}
	
	// Generate random string by length
	for(let i = length; i > 0; --i) result += characters[Math.floor(Math.random() * characters.length)];
	
	return result;
	
}
function goto(location, fade) {
	if(fade === undefined || fade === true){
		$('#content').animate({
			opacity: 0,
		}, 'fast');
	}
	
	if(location == 'reload') return window.location.reload();
	
	window.location = location;
}

function overrideLinks(){

	$body.on('click', 'a', function(e){
		if($(this).attr('href')){
			e.preventDefault();
			goto($(this).attr('href'));
		}
	});
}
function since(timeStamp) {
	var now = new Date(),
		stamp = timeStamp.split(/[- :]/),
		timeStamp = new Date(stamp[0], stamp[1]-1, stamp[2], stamp[3], stamp[4], stamp[5]),
		secondsPast = (now.getTime() - timeStamp.getTime()) / 1000;
	
	if(secondsPast < 60){
		return parseInt(secondsPast) + 's ago';
	}
	if(secondsPast < 3600){
		return parseInt(secondsPast/60) + 'm ago';
	}
	if(secondsPast <= 86400){
		return parseInt(secondsPast/3600) + 'h ago';
	}
	if(secondsPast > 86400){
		let day = timeStamp.getDate();
		let month = timeStamp.toDateString().match(/ [a-zA-Z]*/)[0].replace(' ','');
		let year = timeStamp.getFullYear() == now.getFullYear() ? '' :  ' '+timeStamp.getFullYear();
		return day + ' ' + month + year;
	}
}
function wait($element){
	if($element.data('button-state') !== 'off'){
		
		$element.css({
			width: $element.outerWidth(),
			height: $element.outerHeight(),
		});
		
		$element.addClass('button-wait');
		$element.html(`
			<div class="wait la-ball-fall">
				<div></div>
				<div></div>
				<div></div>
			</div>
		`);
	}
}

function ready($element, html, callback){
	$element.css({
		width: '',
		height: '',
	});
	$element.removeClass('button-wait');
	$element.html(html);
	if(callback != undefined) callback();
}

function applyWaitToButtons(){
	$body.on('click', '.button', function(){
		wait($(this));
	});
}
function validateDOM(){
	var $forms = $body.find('form'),
		$other = $body.find('[data-validate]').not('form'),
		$items = $forms.add($other);
	
	// Validate forms and any other parent div with data-validate
	$items.each(function(){
		if($(this).data('validate') !== 'off'){
			validate($(this), $(this).find('button').last(), random(6), {
				allowDuplicates: true,
			});
		}
	});
}

function validate($obj, $button, name, flags){
	var elements = 'input[type=text], input[type=email], input[type=password]',
		pref = {};
	
	if(flags != undefined) pref = $.extend(pref, flags);
	
	validationNodes[name] = {};
	
	$obj.on('keyup', elements, function(){
		update(false);
	});
	
	$obj.on('blur', elements, function(){
		update(false);
	});
	
	$button.parent().on('click', function(){
		// User trying to submit form while the form isn't complete
		if($(this).find('button').attr('disabled')) update(true);
	});
	
	update(false);
	
	function update(force){
		var data = [],
			temp = [];
		
		if(force == undefined) force = false;
		
		open();
		
		$obj.find(elements).each(function(){
			var name = $(this).val().trim();
			
			if(name != ''){
				if(temp.indexOf(name) === -1 || pref.allowDuplicates){
					temp.push(name);
					data.push({
						val: name,
						attr: this.attributes,
						status: true,
					});
					$(this).removeClass('not-ok');
				}else{
					data.push({
						val: name,
						attr: this.attributes,
						status: 'duplicate',
					});
					if(force) $(this).addClass('not-ok');
					cancel();
				}
			}else if(!this.hasAttribute('required')){
				data.push({
					val: name,
					attr: this.attributes,
					status: true,
				});
				$(this).removeClass('not-ok');
			}else{
				data.push({
					val: name,
					attr: this.attributes,
					status: 'empty',
				});
				if(force) $(this).addClass('not-ok');
				cancel();
			}
		});
		
		validationNodes[name] = data;
	}
	
	function cancel(){
		$button.attr('disabled', '');
		$button.addClass('spotlight');
	}
	
	function open(){
		$button.removeAttr('disabled');
		$button.removeClass('spotlight');
	}
}
function dark($container) {
	var dc = 'dark_container',
		result = '',
		dark_index,
		$dark_module;
	
	if($container == undefined) $container = $('#content');
	result = random(6);
	
	// Index
	dark_index = 50;
	
	// Fade
	$container.after(`
		<div class="${dc}" data-module="${result}">
			<div class="dark_object" disable>
			</div>
		</div>
	`);
	
	$dark_module = $(`.${dc}`).filter(`[data-module="${result}"]`);
	$dark_module.css('z-index', dark_index);
	
	return {
		object: $dark_module,
		run: function(callback){
			$dark_module.find(`.dark_object`).animate({
				opacity: 0.50,
			}, 150, function(){
				if(callback != undefined) callback();
			});
		},
		remove: function(callback){
			$dark_module.find(`.dark_object`).fadeOut(150, function(){
				$dark_module.remove();
				if(callback != undefined) callback();
			});
		},
	};
}
function countdown(duration, display){
	var timer = duration, minutes, seconds;
		
	setInterval(function () {
		minutes = parseInt(timer / 60, 10);
		seconds = parseInt(timer % 60, 10);

		minutes = minutes < 10 ? "0" + minutes : minutes;
		seconds = seconds < 10 ? "0" + seconds : seconds;

		display.text(`${minutes} min, ${seconds} sec`);

		if (--timer < 0) {
			timer = duration;
		}
	}, 1000);
}
function dollar(i, options){
	
	if(!options) options = {};
	
	i = i.replace('$', '');
	i = i.replace(',', '');
	
	if(!Number(i)) i = 0;
	
	i = Number(i);
	i = i.toFixed(2);
	i = i.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	
	
	if(options.sign == undefined || options.sign) i = '$' + i;
	
	return i;
}
	
	return {
		body: $body,
		on: on,
		off: off,
		send: send,
		random: random,
		goto: goto,
		since: since,
		wait: wait,
		ready: ready,
		validate: validate,
		dark: dark,
		countdown: countdown,
		dollar: dollar,
	}
	
})();