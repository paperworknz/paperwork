function newFilter(){
	
	// Paperwork.dark();
	var d = Paperwork.dark(),
		dark_container = d.object,
		fade = d.object.find('.dark_object');
	
	// Copy content
	fade.after(`
		<div class="wt-filter-interface">
			<part class="container-top">
				<div class="h3 title centered">
					Filter Settings
				</div>
			</part>
			<part class="container-mid">
				<table class="wt-filter-interface_table">
					<tbody>
						<tr>
							<td class="wt-border">
								<div class="wt-title">
									My Filters
								</div>
								<div class="wt-existing-filters_container">
								</div>
							</td>
							<td class="wt-new-box">
								<div class="wt-title centered">
									Create New Filter
								</div>
								<div class="wrap" style="padding-bottom:5px;">
									<div class="wt-filter-interface_table-label">
										New Filter Name
									</div>
									<div class="left">
										<input type="text" placeholder="Name" class="wt-filter-name" required />
									</div>
								</div>
								<div class="wrap">
									<div class="wt-filter-interface_table-label">
										Filter By
									</div>
									<div class="left">
										<select class="wt-filter-facade">
										</select>
									</div>
								</div>
								<div class="wt-filter-facade_container">
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</part>
			<part class="container">
				<table class="wt-filter-interface_table">
					<tbody>
						<tr>
							<td>
								<div class="wrap">
									<button class="button right wt-existing-filter-apply" data-button-state="off">
										APPLY
									</button>
								</div>
							</td>
							<td>
								<div class="wrap">
									<button class="button right wt-new-filter-apply" data-button-state="off">
										APPLY
									</button>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</part>
		</div>
	`);
	
	// Vertically align center
	$('.wt-filter-interface').css({
		top: (($(window).height() / 2)) - ($('.wt-filter-interface').height() / 2)
	});
	
	// Binds
	const $f = $('.wt-filter-interface');
	
	// Append existing filters
	var filters = getFilters();
	
	if($.isEmptyObject(filters)){
		$f.find('.wt-existing-filters_container').html(`
			<div>
				You don't have any custom filters
			</div>
		`);
		$f.find('.wt-existing-filter-apply').hide();
	}
	
	for(let i in filters){
		const value = filters[i];
		
		$f.find('.wt-existing-filters_container').append(`
			<div style="wt-existing-filter">
				<input data-filter="${i}" title="${value.status}" class="wt-existing-filter_input" type="text" placeholder="${i}" value="${i}" required />
				<span class="wt-existing-filter_remove">remove</span>
			</div>
		`);
	}
	
	// Remove existing filter
	dark_container.on('click', '.wt-existing-filter_remove', function(){
		var id = $(this).prev().attr('data-filter');
		
		removeFilter(id);
		
		// Update current filter if it's active, remove from options
		if($filter.val() == id) filter('All');
		$filter.find(`option[value="${id}"]`).remove();
		
		render();
		$(this).parent().remove();
		
	});
	
	// Append all statuses to filter-facade
	$filter.find('option').each(function(){
		let id = $(this).attr('value');
		
		if(!filters[id] && id != 'All'){
			$f.find('.wt-filter-facade').append(`
				<option value="${id}">
					${id}
				</option>
			`);
		}
	});
	
	// Blank the facade value
	$f.find('.wt-filter-facade').val('');
	
	// Append to wt-multi-select_container (and hide from filter-facade)
	$f.find('.wt-filter-facade').on('change', function(){
		let id = $(this).val();
		
		$f.find('.wt-filter-facade_container').append(`
			<div class="wt-multi-select">
				<div class="wt-multi-select_object">
					${id}
				</div>
				<span class="wt-multi-select_remove">x</span>
			</div>
		`);
		$(this).find(`option[value="${id}"]`).hide();
		$(this).val('');
	});
	
	// Remove from wt-multi-select_container
	dark_container.on('click', '.wt-multi-select_remove', function(){
		let id = $(this).prev().html().trim();
		
		$f.find(`.wt-filter-facade option[value="${id}"]`).show();
		$(this).closest('.wt-multi-select').remove();
	});
	
	// Fade in
	d.run(function(){
		$('.wt-filter-interface').animate({
			opacity: 1,
		}, 100);
	});
	
	// ----- Apply/cancel
	
	// Listen to existing filter apply
	$f.find('.wt-existing-filter-apply').on('click', function(){
		$('.wt-existing-filter_input').each(function(){
			let id = $(this).attr('data-filter'),
				new_name = $(this).val().trim(),
				filters = getFilters();
			
			// Push new key, remove old key
			if(filters[id]){
				removeFilter(id);
				pushFilter(new_name, {
					status: filters[id].status,
				});
			}
			
			// Update current filter if it's active, remove from options
			if($filter.val() == id) filter('All');
			$filter.find(`option[value="${id}"]`).remove();
			
			render();
			Box.Application.broadcast('notification', 'Saved');
			
		});
	});
	
	// Listen to new filter apply
	$f.find('.wt-new-filter-apply').on('click', function(){
		let new_filter = [],
			name = $('.wt-filter-interface .wt-filter-name').val().trim();
		
		$('.wt-filter-interface .wt-multi-select_object').each(function(){
			let id = $(this).html().trim();
			
			new_filter.push(id);
		});
		
		getFilters();
		pushFilter(name, {
			status: new_filter,
		});
		
		$('.wt-filter-interface').fadeOut(100, function(){
			d.remove(function(){
				render();
				filter(name);
				render();
				$('.wt-filter-interface').off().unbind().remove();
			});
		});
	});
	
	// Cancel on click out of focus
	fade.on('click', function(){
		$('.wt-filter-interface').fadeOut(100, function(){
			d.remove(function(){
				$('.wt-filter-interface').off().unbind().remove();
			});
		});
	});
	
}