Form.prototype.dark = function(form){
	/*
	Remove all abstract interaction from form.
	To reignite, call form.refresh(form) - form should be a.form
	*/
	
	form.off().unbind();
};