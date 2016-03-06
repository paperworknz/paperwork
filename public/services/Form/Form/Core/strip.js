Form.prototype.strip = function(form){
	/*
	Remove interactive tools, return html. Form should be a.form
	*/
	var a= this,
		html= form.clone();
	
	html = a.p.strip(html);
	
	return html.html();
};