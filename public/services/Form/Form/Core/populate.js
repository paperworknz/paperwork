Form.prototype.populate = function(form, data){
	var a= this;
	
	a.p.set('date', form, data.date);
	a.p.set('jobID', form, data.jobID);
	a.p.set('client', form, data.client);
};