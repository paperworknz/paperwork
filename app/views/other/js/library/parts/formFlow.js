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