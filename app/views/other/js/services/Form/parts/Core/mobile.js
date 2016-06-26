Form.prototype.mobile = function(form){
	/*
	This layer constructs a mobile interface
	*/
	var a= this,
		form_id= form.attr('data-formid'),
		map = a.map[form_id];
	
	if(form.find('[form-date]')) map.date = form.find('[form-date]').html();
	if(form.find('[form-jobid]')) map.job_number = form.find('[form-jobid]').html();
	if(form.find('[form-clientblob]')) map.client = form.find('[form-clientblob]').html();
	if(form.find('[form-jobd]')) map.description = form.find('[form-jobb]').html();
	
	console.log(a.map);
};