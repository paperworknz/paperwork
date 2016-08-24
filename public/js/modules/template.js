"use strict";Core.addModule("template",function(t){function e(){var t={select:p.find(".template-icon"),"delete":p.find(".template-delete"),create:p.find('[data-type="template-create"]'),update:p.find('[data-type="properties-update"]')};for(var e in t)t[e].off();p.find('[data-type="template-name"]').on("keyup",function(){var t=$(this).closest('[data-type="obj"]').data("id");o(),"+"!=t&&p.find('[data-type="tab-container"] [data-id="'+t+'"]').html($(this).val())}),p.find('[data-type="template-name"]').on("change",function(){var t=$(this).closest("[data-template-id]").data("template-id"),e=$(this).val().trim();$.post(l.putTemplate,{id:t,name:e}).done(function(t){o(),Paperwork.send("notification")})}),t.create.on("click",function(){var t=p.find('.new-template [data-type="new-template-name"]').val().trim();$.post(l.post,{name:t}).done(function(t){var e=JSON.parse(t);p.find('.new-template [data-type="new-template-name"]').val(""),a({id:e.id,name:e.name,body:e.body}),Paperwork.ready(p.find('[data-type="template-create"]'),"CREATE")})}),Paperwork.validate(p.find(".new-template"),t.create,Paperwork.random(6),{allowDuplicates:!0}),p.on("click",'[data-type="previous"]',function(){n("previous")}),p.on("click",'[data-type="next"]',function(){n("next")}),p.on("mouseover",'[data-type="row"]',function(){var t=$(this).find('[data-type="key"]').text().trim();-1==t.indexOf("colour")&&p.find('[data-property="'+t+'"]').css("background-color","#D6EDFF")}),p.on("mouseout",'[data-type="row"]',function(){var t=$(this).find('[data-type="key"]').text().trim();-1==t.indexOf("colour")&&p.find('[data-property="'+t+'"]').css("background-color","")}),d()}function a(e){var a,n=p.find('[data-type="tab-container"] ul'),i=p.find('[data-type="obj-container"]');a=n.children().last().prev().data("id")+1,isNaN(a)&&(a=0),n.children().last().before('\n			<li data-type="tab" data-id="'+a+'" class="tab" style="opacity: 0.5;">'+e.name+"</li>\n		"),p.find('[data-type="tab"]').filter('[data-id="'+a+'"]').animate({opacity:1},300,"swing"),i.children().last().before('\n			<box data-type="obj" data-id="'+a+'" data-template-id="'+e.id+'" class="tabobj">\n				<div class="template-container">\n					<div class="container">\n						<input type="text" class="template-name" data-type="template-name" placeholder="Template name" value="'+e.name+'" required>\n					</div>\n					<hr>\n					<div style="position: relative;overflow: hidden;">\n						<div data-type="document" data-id="{{i}}" class="template-document" style="opacity: 0.25;padding: 10mm 0;">\n							'+e.body+'\n						</div>\n						<div data-type="template-hud" class="template-hud">\n							<div class="play-container" style="padding-right: 50mm;">\n								<div data-type="previous" class="play-padding">\n									<div class="play-left"></div>\n								</div>\n							</div>\n							<div class="play-container" style="padding-left: 50mm;">\n								<div data-type="next" class="play-padding">\n									<div class="play-right"></div>\n								</div>\n							</div>\n						</div>\n					</div>\n				</div>\n			</box>\n		'),o(),Paperwork.send("tab."+t.name+".activate",a)}function n(t){function e(){$.post(l.update,{id:n,direction:t}).done(function(t){t=JSON.parse(t),p.find('.tabopen [data-type="document"]').html(t.body).css({opacity:0,marginLeft:a+"px"}).animate({opacity:1,marginLeft:0},100,"swing"),o()})}var a,n=p.find(".tabopen").data("template-id");a="previous"==t?"-10":"10",p.find('.tabopen [data-type="document"]').animate({opacity:0,marginLeft:-1*a+"px"},100,"swing",e)}function i(){$.get(l.get).done(function(t){t=JSON.parse(t),r=t,o()})}function d(){p.on("keyup",'[data-type="properties"] .prop',function(){r[$(this).closest('[data-type="row"]').find('[data-type="key"]').text().trim()]=$(this).html(),o()}),p.on("blur",'[data-type="properties"] .prop',function(){$.post(l.putProp,{properties:r}).done(function(t){Paperwork.send("notification")})})}function o(t){Paperwork.send("document.template.reload",r)}var p=t.element,r={},l={get:environment.root+"/get/template-properties",update:environment.root+"/post/update-template",post:environment.root+"/post/template","delete":environment.root+"/delete/template",putProp:environment.root+"/put/properties",putTemplate:environment.root+"/put/template"};t.use("tab"),t.use("document"),e(),i()});