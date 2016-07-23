"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol?"symbol":typeof t},Table=function(t,n){function e(){y.on("mouseover",i),y.on("mouseout",i),k.on("click",v),y.on("click",function(){Paperwork["goto"](t(this).attr("href"))}),b.find("[wt-head]").on("click",function(){var n=t(this).closest(".wt-column").attr("data-id"),e=t(this).closest(".wt-head");o(n,e)}),x.on("change",function(){var n=t(this).val();c(n),l()}),void 0!=interact&&interact(".wt-column").resizable({edges:{right:!0}}).on("resizemove",function(n){var e=n.target,i=t(e).attr("data-id"),a=n.rect.width+"px";e.style.width=a,m.columns[i].width=a,r()}).allowFrom(".wt-head"),void 0!=Sortable&&new Sortable(document.getElementById("sortable"),{handle:".wt-head",animation:150,ghostClass:"wt-column-ghost",onEnd:function(n){t(".wt-column").each(function(n){m.columns[t(this).attr("data-id")].index=n,r()})}})}function i(t){var n=this.attributes["data-row"].value;b.find('[data-row="'+n+'"]').toggleClass("wt-row-hover")}function a(){if(localStorage.map)return void(m=JSON.parse(localStorage.map));var t=g.filter?g.filter:"All";m={filter:t,columns:{}},S.each(function(t){var n=this.attributes["data-id"].value,e=g.width[n]?g.width[n]:"";m.columns[n]={index:t,state:"def",stateOrder:t,width:e}}),r()}function r(){return localStorage?void(localStorage.map=JSON.stringify(m)):void console.warn("Unable to save map to localStorage")}function o(t,n){function e(t,n,e){var i=t.indexOf(n);if(-1===i)throw new Error("Element not found in array");return 0>e&&(e=0),"end"==e&&(e=t.length+1),t.splice(i,1),t.splice(e,0,n),t}var i=n.attr("data-state"),a=[];for(var o in m.columns){var s=m.columns[o];a[s.stateOrder]=o}switch(a="desc"!=i?e(a,t,0):e(a,t,"end"),i){case"asc":i="desc",m.columns[t].state=i;break;case"desc":i="def",m.columns[t].state=i;break;case"def":i="asc",m.columns[t].state=i}for(var c in m.columns){var d=(m.columns[c],a.indexOf(c));m.columns[c].stateOrder=d}r(),l()}function l(){var e,i=[],a=[];e=d();for(var r in e){e[r];x.find('option[value="'+r+'"]').length||x.append('\n				<option value="'+r+'">\n					'+r+"\n				</option>\n			")}x.val(m.filter),"All"==m.filter?y.show():!function(){var n=[];y.hide(),e[m.filter]?n=e[m.filter].status:n[0]=m.filter,S.filter('[data-id="Status"]').find(".wt-row").each(function(){var e=this;-1!==n.indexOf(t(this).text())&&!function(){var n=e.attributes["data-row"].value;y.each(function(){this.attributes["data-row"].value==n&&t(this).show()})}()})}(),a=function(t){for(var n in t){var e=t[n];a[e.index]=S.filter('[data-id="'+n+'"]')}return a}(m.columns);for(var o in a){var l=a[o];b.find(".wt-wrap").append(l)}i=function(t){for(var n in t){var e=t[n];i[e.stateOrder]=n}return i.reverse()}(m.columns);for(var c in i){var f=i[c],u=S.filter('[data-id="'+f+'"]');"asc"==m.columns[f].state?(u.find("img").css("display","block"),u.find("img").attr("src",n.root+"/css/media/up.png"),u.find(".wt-head").attr("data-state","asc"),s(f,"asc")):"desc"==m.columns[f].state?(u.find("img").css("display","block"),u.find("img").attr("src",n.root+"/css/media/down.png"),u.find(".wt-head").attr("data-state","desc"),s(f,"desc")):"def"==m.columns[f].state&&(u.find("img").css("display","none"),u.find(".wt-head").attr("data-state","def"),s(f,"def"))}for(var v in m.columns){var w=m.columns[v];S.filter("[data-id="+v+"]").css("width",w.width)}b.css("display","block")}function s(n,e){var i='.wt-column[data-id="'+n+'"]',a=(t(i).find(".wt-row"),[]);switch(e){case"def":tinysort(i+" .wt-row",{attr:"data-row"});break;case"asc":tinysort(i+" .wt-row",{order:"asc"});break;case"desc":tinysort(i+" .wt-row",{order:"desc"})}b.find('.wt-column[data-id="'+n+'"] .wt-row').each(function(){a.push(t(this).attr("data-row"))}),S.each(function(){var e=this,i=t(this);t(this).attr("data-id")!=n&&!function(){var n={};t(e).find(".wt-row").each(function(){n[t(this).attr("data-row")]=t(this)});for(var r=0,o=a.length;o>r;r++)n[a[r]]&&i.append(n[a[r]])}()})}function c(t){t||(t="All"),x.find('[value="'+t+'"]').length||console.warn("Filter "+t+" unavailable"),m.filter=t,r()}function d(){return localStorage?(localStorage.filter||(localStorage.filter=JSON.stringify({})),JSON.parse(localStorage.filter)):console.warn("Unable to access localStorage")}function f(t,n){var e=d();return"string"===!("undefined"==typeof t?"undefined":_typeof(t))?console.warn("No filter name given for new filter"):(e[t]=n,void(localStorage.filter=JSON.stringify(e)))}function u(t){var n=d();n[t]&&delete n[t],localStorage.filter=JSON.stringify(n)}function v(){var n=Paperwork.dark(),e=n.object,i=n.object.find(".dark_object");i.after('\n		<div class="wt-filter-interface">\n			<part class="container-top">\n				<div class="h3 title centered">\n					Filter Settings\n				</div>\n			</part>\n			<part class="container-mid">\n				<table class="wt-filter-interface_table">\n					<tbody>\n						<tr>\n							<td class="wt-border">\n								<div class="wt-title">\n									My Filters\n								</div>\n								<div class="wt-existing-filters_container">\n								</div>\n							</td>\n							<td class="wt-new-box">\n								<div class="wt-title centered">\n									Create New Filter\n								</div>\n								<div class="wrap" style="padding-bottom:5px;">\n									<div class="wt-filter-interface_table-label">\n										New Filter Name\n									</div>\n									<div class="left">\n										<input type="text" placeholder="Name" class="wt-filter-name" required />\n									</div>\n								</div>\n								<div class="wrap">\n									<div class="wt-filter-interface_table-label">\n										Filter By\n									</div>\n									<div class="left">\n										<select class="wt-filter-facade">\n										</select>\n									</div>\n								</div>\n								<div class="wt-filter-facade_container">\n								</div>\n							</td>\n						</tr>\n					</tbody>\n				</table>\n			</part>\n			<part class="container">\n				<table class="wt-filter-interface_table">\n					<tbody>\n						<tr>\n							<td>\n								<div class="wrap">\n									<button class="button right wt-existing-filter-apply" data-button-state="off">\n										APPLY\n									</button>\n								</div>\n							</td>\n							<td>\n								<div class="wrap">\n									<button class="button right wt-new-filter-apply" data-button-state="off">\n										APPLY\n									</button>\n								</div>\n							</td>\n						</tr>\n					</tbody>\n				</table>\n			</part>\n		</div>\n	'),t(".wt-filter-interface").css({top:t(window).height()/2-t(".wt-filter-interface").height()/2});var a=t(".wt-filter-interface"),r=d();t.isEmptyObject(r)&&(a.find(".wt-existing-filters_container").html("\n			<div>\n				You don't have any custom filters\n			</div>\n		"),a.find(".wt-existing-filter-apply").hide());for(var o in r){var s=r[o];a.find(".wt-existing-filters_container").append('\n			<div style="wt-existing-filter">\n				<input data-filter="'+o+'" title="'+s.status+'" class="wt-existing-filter_input" type="text" placeholder="'+o+'" value="'+o+'" required />\n				<span class="wt-existing-filter_remove">remove</span>\n			</div>\n		')}e.on("click",".wt-existing-filter_remove",function(){var n=t(this).prev().attr("data-filter");u(n),x.val()==n&&c("All"),x.find('option[value="'+n+'"]').remove(),l(),t(this).parent().remove()}),x.find("option").each(function(){var n=t(this).attr("value");r[n]||"All"==n||a.find(".wt-filter-facade").append('\n				<option value="'+n+'">\n					'+n+"\n				</option>\n			")}),a.find(".wt-filter-facade").val(""),a.find(".wt-filter-facade").on("change",function(){var n=t(this).val();a.find(".wt-filter-facade_container").append('\n			<div class="wt-multi-select">\n				<div class="wt-multi-select_object">\n					'+n+'\n				</div>\n				<span class="wt-multi-select_remove">x</span>\n			</div>\n		'),t(this).find('option[value="'+n+'"]').hide(),t(this).val("")}),e.on("click",".wt-multi-select_remove",function(){var n=t(this).prev().html().trim();a.find('.wt-filter-facade option[value="'+n+'"]').show(),t(this).closest(".wt-multi-select").remove()}),n.run(function(){t(".wt-filter-interface").animate({opacity:1},100)}),a.find(".wt-existing-filter-apply").on("click",function(){t(".wt-existing-filter_input").each(function(){var n=t(this).attr("data-filter"),e=t(this).val().trim(),i=d();i[n]&&(u(n),f(e,{status:i[n].status})),x.val()==n&&c("All"),x.find('option[value="'+n+'"]').remove(),l(),Box.Application.broadcast("notification","Saved")})}),a.find(".wt-new-filter-apply").on("click",function(){var e=[],i=t(".wt-filter-interface .wt-filter-name").val().trim();t(".wt-filter-interface .wt-multi-select_object").each(function(){var n=t(this).html().trim();e.push(n)}),d(),f(i,{status:e}),t(".wt-filter-interface").fadeOut(100,function(){n.remove(function(){l(),c(i),l(),t(".wt-filter-interface").off().unbind().remove()})})}),i.on("click",function(){t(".wt-filter-interface").fadeOut(100,function(){n.remove(function(){t(".wt-filter-interface").off().unbind().remove()})})})}function w(t){if(!t)return console.warn("No configuration supplied");if(a(),t.filter&&c(t.filter),t.width)for(var n in t.width){var e=t.width[n];g.width[n]&&(g.width[n]=e)}p()}function p(){e(),a(),l()}function h(){localStorage&&delete localStorage.map,p()}var m,g,b,y,S,x,k;return t(".wt-table").length<1?void 0:(t(".wt-table").each(function(){t(this).data("id")||(t(this).attr("data-id",Paperwork.random(6)),b=t(this))}),y=b.find(".wt-row"),S=b.find(".wt-column"),x=b.find(".wt-filter"),k=b.find(".wt-settings"),g={filter:"All",width:{ID:"44px",Name:"260px",Client:"165px",Status:"111px"}},p(),{configure:w,run:p,reset:h})}(jQuery,environment);