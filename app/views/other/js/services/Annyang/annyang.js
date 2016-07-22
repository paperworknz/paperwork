Core.addService('annyang', function(){
	
	var commands;
	construct();
	
	function construct(){
		if(!localStorage.annyang) return localStorage.annyang = 'false';
		if(localStorage.annyang == 'false') return;
		
		commands = {
			'go to job :job': goto,
			'open *command': open,
		};
		
		annyang.addCommands(commands);
		annyang.start();
	}
	
	function addCommand(command){
		annyang.addCommands(command);
	}
	
	function goto(job){
		if(Number(job)) Paperwork.goto(`${environment.root}/job/${job}`);
	}
	
	function open(command){
		
		var data = '';
		command = command.toLowerCase();
		
		if(command.indexOf('home') !== -1) command = 'app';
		if(command.indexOf('template') !== -1) command = 'template';
		if(command.indexOf('jobs') !== -1) command = 'jobs';
		if(command.indexOf('inventory') !== -1) command = 'inventory';
		if(command.indexOf('settings') !== -1) command = 'settings';
		
		// Job
		if(command.indexOf('job') !== -1 && command.indexOf('jobs') == -1){
			data = command.match(/\d+/)[0];
			command = 'job';
		}
		
		Core.loadModule(command, data);
	}
	
	return {
		add: addCommand,
	}
});