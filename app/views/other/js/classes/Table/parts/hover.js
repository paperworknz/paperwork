function hover(state){
	let row = this.attributes['data-row'].value;
	$table.find(`[data-row="${row}"]`).toggleClass('wt-row-hover');
}