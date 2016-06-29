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
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
		<meta name='viewport' content='width=device-width,initial-scale=1.0'>
	</head>
	<body>
	${html}
	</body>
	`;
	
	// Callback function
	callback(name, page);
};