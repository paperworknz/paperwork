"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol?"symbol":typeof t},Table=function(t,e){function n(t){var e=this.attributes["data-row"].value;m.find('[data-row="'+e+'"]').toggleClass("wt-row-hover")}function i(){if(localStorage.map)return void(h=JSON.parse(localStorage.map));var t=S.filter?S.filter:"All";h={filter:t,columns:{}},b.each(function(t){var e=this.attributes["data-id"].value,n=S.width[e]?S.width[e]:"";h.columns[e]={index:t,state:"def",stateOrder:t,width:n}}),a()}function a(){return localStorage?void(localStorage.map=JSON.stringify(h)):void console.warn("Unable to save map to localStorage")}function r(t,e){function n(t,e,n){var i=t.indexOf(e);if(-1===i)throw new Error("Element not found in array");return 0>n&&(n=0),"end"==n&&(n=t.length+1),t.splice(i,1),t.splice(n,0,e),t}var i=e.attr("data-state"),r=[];for(var o in h.columns){var s=h.columns[o];r[s.stateOrder]=o}switch(r="desc"!=i?n(r,t,0):n(r,t,"end"),i){case"asc":i="desc",h.columns[t].state=i;break;case"desc":i="def",h.columns[t].state=i;break;case"def":i="asc",h.columns[t].state=i}for(var c in h.columns){var f=(h.columns[c],r.indexOf(c));h.columns[c].stateOrder=f}a(),l()}function l(){var n,i=[],a=[];n=c();for(var r in n){n[r];y.find('option[value="'+r+'"]').length||y.append('\n				<option value="'+r+'">\n					'+r+"\n				</option>\n			")}y.val(h.filter),"All"==h.filter?g.show():!function(){var e=[];g.hide(),n[h.filter]?e=n[h.filter].status:e[0]=h.filter,b.filter('[data-id="Status"]').find(".wt-row").each(function(){var n=this;-1!==e.indexOf(t(this).text())&&!function(){var e=n.attributes["data-row"].value;g.each(function(){this.attributes["data-row"].value==e&&t(this).show()})}()})}(),a=function(t){for(var e in t){var n=t[e];a[n.index]=b.filter('[data-id="'+e+'"]')}return a}(h.columns);for(var l in a){var s=a[l];t(".wt-wrap").append(s)}i=function(t){for(var e in t){var n=t[e];i[n.stateOrder]=e}return i.reverse()}(h.columns);for(var f in i){var d=i[f],u=b.filter('[data-id="'+d+'"]');"asc"==h.columns[d].state?(u.find("img").css("display","block"),u.find("img").attr("src",e.root+"/css/app/media/up.png"),u.find(".wt-head").attr("data-state","asc"),o(d,"asc")):"desc"==h.columns[d].state?(u.find("img").css("display","block"),u.find("img").attr("src",e.root+"/css/app/media/down.png"),u.find(".wt-head").attr("data-state","desc"),o(d,"desc")):"def"==h.columns[d].state&&(u.find("img").css("display","none"),u.find(".wt-head").attr("data-state","def"),o(d,"def"))}for(var v in h.columns){var w=h.columns[v];b.filter("[data-id="+v+"]").css("width",w.width)}m.css("display","block")}function o(e,n){var i='.wt-column[data-id="'+e+'"]',a=(t(i).find(".wt-row"),[]);switch(n){case"def":tinysort(i+" .wt-row",{attr:"data-row"});break;case"asc":tinysort(i+" .wt-row",{order:"asc"});break;case"desc":tinysort(i+" .wt-row",{order:"desc"})}t('.wt-column[data-id="'+e+'"] .wt-row').each(function(){a.push(t(this).attr("data-row"))}),b.each(function(){var n=this,i=t(this);t(this).attr("data-id")!=e&&!function(){var e={};t(n).find(".wt-row").each(function(){e[t(this).attr("data-row")]=t(this)});for(var r=0,l=a.length;l>r;r++)e[a[r]]&&i.append(e[a[r]])}()})}function s(t){t||(t="All"),y.find('[value="'+t+'"]').length||console.warn("Filter "+t+" unavailable"),h.filter=t,a()}function c(){return localStorage?(localStorage.filter||(localStorage.filter=JSON.stringify({})),JSON.parse(localStorage.filter)):void console.warn("Unable to access localStorage")}function f(t,e){var n=c();return"string"===!("undefined"==typeof t?"undefined":_typeof(t))?void console.warn("No filter name given for new filter"):(n[t]=e,void(localStorage.filter=JSON.stringify(n)))}function d(t){var e=c();e[t]&&delete e[t],localStorage.filter=JSON.stringify(e)}function u(){var e=dark(),n=e.object,i=e.object.find(".dark_object");i.after('\n			<div class="wt-filter-interface">\n				<div class="h3 ac" style="margin:10px 0px 20px 0px">\n					Filter Settings\n				</div>\n				<table class="wt-filter-interface_table">\n					<tbody>\n						<tr>\n							<td class="wt-border">\n								<div class="wt-title ac">\n									My Filters\n								</div>\n								<div class="wt-existing-filters_container">\n								</div>\n							</td>\n							<td>\n								<div class="wt-title ac">\n									Create New Filter\n								</div>\n								<div class="wrapper">\n									<div class="wt-filter-interface_table-label">\n										New Filter Name\n									</div>\n									<div class="pull-left">\n										<input type="text" placeholder="Name" class="wt-filter-name" required />\n									</div>\n								</div>\n								<div class="wrapper">\n									<div class="wt-filter-interface_table-label">\n										Filter By\n									</div>\n									<div class="pull-left">\n										<select class="wt-filter-facade">\n										</select>\n									</div>\n								</div>\n								<div class="wt-filter-facade_container">\n								</div>\n								\n							</td>\n						</tr>\n						<tr>\n							<td>\n								<div class="wrapper">\n									<button class="wolfe-btn pull-right wt-existing-filter-apply" style="margin:5px 5px 0px 0px;">\n										APPLY\n									</button>\n								</div>\n							</td>\n							<td>\n								<div class="wrapper">\n									<button class="wolfe-btn pull-right wt-new-filter-apply" style="margin:5px 5px 0px 0px;">\n										APPLY\n									</button>\n								</div>\n							</td>\n						</tr>\n					</tbody>\n				</table>\n			</div>\n		'),t(".wt-filter-interface").css({top:t(window).height()/2-t(".wt-filter-interface").height()/2});var a=t(".wt-filter-interface"),r=c();t.isEmptyObject(r)&&a.find(".wt-existing-filter-apply").hide();for(var o in r){var u=r[o];a.find(".wt-existing-filters_container").append('\n				<div style="wt-existing-filter">\n					<input data-filter="'+o+'" title="'+u.status+'" class="wt-existing-filter_input" type="text" placeholder="'+o+'" value="'+o+'" required />\n					<span class="wt-existing-filter_remove">remove</span>\n				</div>\n			')}n.on("click",".wt-existing-filter_remove",function(){var e=t(this).prev().attr("data-filter");d(e),y.val()==e&&s("All"),y.find('option[value="'+e+'"]').remove(),l(),t(this).parent().remove()}),y.find("option").each(function(){var e=t(this).attr("value");r[e]||a.find(".wt-filter-facade").append('\n					<option value="'+e+'">\n						'+e+"\n					</option>\n				")}),a.find(".wt-filter-facade").val(""),a.find(".wt-filter-facade").on("change",function(){var e=t(this).val();a.find(".wt-filter-facade_container").append('\n				<div class="wt-multi-select">\n					<div class="wt-multi-select_object">\n						'+e+'\n					</div>\n					<span class="wt-multi-select_remove">x</span>\n				</div>\n			'),t(this).find('option[value="'+e+'"]').hide(),t(this).val("")}),n.on("click",".wt-multi-select_remove",function(){var e=t(this).prev().html().trim();a.find('.wt-filter-facade option[value="'+e+'"]').show(),t(this).closest(".wt-multi-select").remove()}),e.run(function(){t(".wt-filter-interface").animate({opacity:1},100)}),a.find(".wt-existing-filter-apply").on("click",function(){t(".wt-existing-filter_input").each(function(){var e=t(this).attr("data-filter"),n=t(this).val().trim(),i=c();i[e]&&(d(e),f(n,{status:i[e].status})),y.val()==e&&s("All"),y.find('option[value="'+e+'"]').remove(),l(),Paperwork.saved()})}),a.find(".wt-new-filter-apply").on("click",function(){var n=[],i=t(".wt-filter-interface .wt-filter-name").val().trim();t(".wt-filter-interface .wt-multi-select_object").each(function(){var e=t(this).html().trim();n.push(e)}),c(),f(i,{status:n}),t(".wt-filter-interface").fadeOut(100,function(){e.remove(function(){l(),s(i),l(),t(".wt-filter-interface").off().unbind().remove()})})}),i.on("click",function(){t(".wt-filter-interface").fadeOut(100,function(){e.remove(function(){t(".wt-filter-interface").off().unbind().remove()})})})}function v(t){if(!t)return console.warn("No configuration supplied"),!1;if(i(),t.filter&&s(t.filter),t.width)for(var e in t.width){var n=t.width[e];S.width[e]&&(S.width[e]=n)}w()}function w(){i(),l()}function p(){localStorage&&delete localStorage.map,w()}var h,m=t(".wt-table"),g=m.find(".wt-row"),b=m.find(".wt-column"),y=m.find(".wt-filter"),x=m.find(".wt-settings"),S={filter:"All",width:{ID:"44px",Name:"260px",Client:"165px",Status:"111px"}};return g.on("mouseover",n),g.on("mouseout",n),x.on("click",u),g.on("click",function(){goto(t(this).attr("href"))}),m.find("[wt-head]").on("click",function(){var e=t(this).closest(".wt-column").attr("data-id"),n=t(this).closest(".wt-head");r(e,n)}),y.on("change",function(){var e=t(this).val();s(e),l()}),void 0!=interact&&interact(".wt-column").resizable({edges:{right:!0}}).on("resizemove",function(e){var n=e.target,i=t(n).attr("data-id"),r=e.rect.width+"px";n.style.width=r,h.columns[i].width=r,a()}).allowFrom(".wt-head"),void 0!=Sortable&&new Sortable(document.getElementById("sortable"),{handle:".wt-head",animation:150,ghostClass:"wt-column-ghost",onEnd:function(e){t(".wt-column").each(function(e){h.columns[t(this).attr("data-id")].index=e,a()})}}),{configure:v,run:w,reset:p}}(jQuery,environment);