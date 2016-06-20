Form.prototype.pdf = function(form, callback){
	var a= this,
		form_id= form.attr('data-formid'),
		tab= $(`.${a.tab.activeTab}`),
		html= form.clone();
	
	// Strip and get html
	html = a.strip(html);
	
	// PDF
	var name = `${environment.job_number}_${tab.attr('data-tab')}-${tab.html().trim().toLowerCase()}`.trim();
	var page = 
	`
	<!DOCTYPE html>
	<html lang='en'>
	<head>
		<meta name='viewport' content='width=device-width,initial-scale=1.0'>
		<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css' type='text/css'>
	</head>
	<body>
	${html}
	</body>
	`;
	
	// Callback function
	callback(name, page);
};