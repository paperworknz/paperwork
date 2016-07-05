function since(timeStamp) {
	var now = new Date(),
		stamp = timeStamp.split(/[- :]/),
		timeStamp = new Date(stamp[0], stamp[1]-1, stamp[2], stamp[3], stamp[4], stamp[5]),
		secondsPast = (now.getTime() - timeStamp.getTime()) / 1000;
	
	if(secondsPast < 60){
		return parseInt(secondsPast) + 's ago';
	}
	if(secondsPast < 3600){
		return parseInt(secondsPast/60) + 'm ago';
	}
	if(secondsPast <= 86400){
		return parseInt(secondsPast/3600) + 'h ago';
	}
	if(secondsPast > 86400){
		let day = timeStamp.getDate();
		let month = timeStamp.toDateString().match(/ [a-zA-Z]*/)[0].replace(' ','');
		let year = timeStamp.getFullYear() == now.getFullYear() ? '' :  ' '+timeStamp.getFullYear();
		return day + ' ' + month + year;
	}
}