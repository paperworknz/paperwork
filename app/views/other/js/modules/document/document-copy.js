Core.addModule('document-copy', function(context){
	
	var $body = context.element;
	
	$body.on('click', '[data-type="new-document"]', function(){
		Paperwork.send('document.job.copy', $(this).data('template-id'));
	});
});