function preventBackspace(){
	let exclusions = 'input, select, textarea, [contenteditable]';
	
	$body.on('keydown', function(event){
		let code = event.keyCode || event.which,
			$target = $(event.target);
		
		if(code === 8 && !$target.is(exclusions)) event.preventDefault();
	});
}