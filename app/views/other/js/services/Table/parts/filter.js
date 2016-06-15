function filter(filter){
	
	if(!filter) filter = 'All';
	
	if(!$filter.find(`[value="${filter}"]`).length){
		console.warn(`Filter ${filter} unavailable`);
	}
	
	map.filter = filter;
	setMap();
}

function getFilters(){
	
	if(!localStorage){
		console.warn('Unable to access localStorage');
		return;
	}
	
	// Make empty object if no filters exist
	if(!localStorage.filter) localStorage.filter = JSON.stringify({});
	
	// Return filter object
	return JSON.parse(localStorage.filter);
}

function pushFilter(name, filter){
	
	let filters = getFilters();
	
	if(!typeof name === 'string'){
		console.warn('No filter name given for new filter');
		return;
	}
	
	// Set filter by name (may override)
	filters[name] = filter;
	
	// Store filter in localStorage
	localStorage.filter = JSON.stringify(filters);
}

function removeFilter(name){
	
	let filters = getFilters();
	
	if(filters[name]) delete filters[name];
	
	localStorage.filter = JSON.stringify(filters);
}

function newFilter(){
		
		// Paperwork dark();
		var d = dark();
		var dark_container = d.object;
		var fade = d.object.find('.dark_object');
		
		// Copy content
		fade.after(`
			<div class="wt-filter-interface">
				<div class="h3 ac" style="margin:10px 0px 20px 0px">
					Filter Settings
				</div>
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
							<td>
								<div class="wt-title ac">
									Create New Filter
								</div>
								<div class="wrapper">
									<div class="wt-filter-interface_table-label">
										New Filter Name
									</div>
									<div class="pull-left">
										<input type="text" placeholder="Name" class="wt-filter-name" required />
									</div>
								</div>
								<div class="wrapper">
									<div class="wt-filter-interface_table-label">
										Filter By
									</div>
									<div class="pull-left">
										<select class="wt-filter-facade">
										</select>
									</div>
								</div>
								<div class="wt-filter-facade_container">
								</div>
								
							</td>
						</tr>
						<tr>
							<td>
								<div class="wrapper">
									<button class="wolfe-btn pull-right wt-existing-filter-apply" style="margin:5px 5px 0px 0px;">
										APPLY
									</button>
								</div>
							</td>
							<td>
								<div class="wrapper">
									<button class="wolfe-btn pull-right wt-new-filter-apply" style="margin:5px 5px 0px 0px;">
										APPLY
									</button>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
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
			
			if(!filters[id]){
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
				Paperwork.saved();
				
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