function bind(){

	// Hover table rows
	$row.on('mouseover', hover);
	$row.on('mouseout', hover);

	// Reset Changes
	$settings.on('click', newFilter);

	// When a row is clicked, Paperwork.goto(href)
	$row.on('click', function(){
		Paperwork.goto($(this).attr('href'));
	});

	// Click column head to run state()
	$table.find('[wt-head]').on('click', function(){
		let id = $(this).closest('.wt-column').attr('data-id'),
			$head = $(this).closest('.wt-head');
		state(id, $head);
	});

	// Run filter() when filter select is changed
	$filter.on('change', function(){
		let value = $(this).val();
		filter(value);
		render();
	});

	// The following two functions do not re-render the table
	// and are non-crucial

	// Resizable columns (horizontally) 
	if(interact != undefined){
		interact('.wt-column').resizable({
			edges: {
				right: true
			}
		}).on('resizemove', function(event){
			let target = event.target,
				id = $(target).attr('data-id'),
				width = event.rect.width + 'px';
			
			target.style.width = width; // Update css width
			map.columns[id].width = width; // Update map
			setMap(); // Save map
			
		}).allowFrom('.wt-head');
	}

	// Rearrangable columns (horizontally)
	if(Sortable != undefined){
		new Sortable(document.getElementById('sortable'), {
			handle: '.wt-head',
			animation: 150,
			ghostClass: 'wt-column-ghost',
			onEnd: function(event){
				$('.wt-column').each(function(event){
					map.columns[$(this).attr('data-id')].index = event;
					setMap();
				});
			}
		});
	}
}