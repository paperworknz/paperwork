Form.prototype.pdf = function(form, callback){
	var a= this,
		form_id= form.attr('data-formid'),
		tab= $('[data-type="tab-container"] .active'),
		html= form.clone();
	
	// Strip and get html
	html = a.strip(html);
	
	// PDF
	var name = `${job.job_number}_${tab.attr('data-id')}-${tab.html().trim().toLowerCase()}`.trim();
	var page = 
	`
	<!DOCTYPE html>
	<html lang='en'>
	<head>
		<meta name='viewport' content='width=device-width,initial-scale=1.0'>
		<link rel="stylesheet" type="text/css" href="http://paperwork.nz/css/library/Paperwork.css?w6Z7RC">
		<style>
			body, html {
				background-color: white;
				background: white;
			}
		</style>
	</head>
	<body>
	${html}
	</body>
	`;
	
	// Callback function
	callback(name, page);
};