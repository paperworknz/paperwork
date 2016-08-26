"use strict";Core.addModule("template",function(t){function e(){var t={select:l.find(".template-icon"),"delete":l.find(".template-delete"),create:l.find('[data-type="template-create"]'),update:l.find('[data-type="properties-update"]')};for(var e in t)t[e].off();l.find('[data-type="template-name"]').on("keyup",function(){var t=$(this).closest('[data-type="obj"]').data("id");o(),"+"!=t&&l.find('[data-type="tab-container"] [data-id="'+t+'"]').html($(this).val())}),l.find('[data-type="template-name"]').on("change",function(){var t=$(this).closest("[data-template-id]").data("template-id"),e=$(this).val().trim();$.post(c.putTemplate,{id:t,name:e}).done(function(t){o(),Paperwork.send("notification")})}),t.create.on("click",function(){var t=l.find('.new-template [data-type="new-template-name"]').val().trim();$.post(c.post,{name:t}).done(function(t){var e=JSON.parse(t);l.find('.new-template [data-type="new-template-name"]').val(""),a({id:e.id,name:e.name,body:e.body}),Paperwork.ready(l.find('[data-type="template-create"]'),"CREATE")})}),Paperwork.validate(l.find(".new-template"),t.create,Paperwork.random(6),{allowDuplicates:!0}),l.on("click",'[data-type="previous"]',function(){n("previous")}),l.on("click",'[data-type="next"]',function(){n("next")}),l.on("mouseover",'[data-type="row"]',function(){var t=$(this).find('[data-type="key"]').text().trim();-1==t.indexOf("colour")&&l.find('[data-property="'+t+'"]').css("background-color","#D6EDFF")}),l.on("mouseout",'[data-type="row"]',function(){var t=$(this).find('[data-type="key"]').text().trim();-1==t.indexOf("colour")&&l.find('[data-property="'+t+'"]').css("background-color","")}),d()}function a(e){var a,n=l.find('[data-type="tab-container"] ul'),i=l.find('[data-type="obj-container"]');a=n.children().last().prev().data("id")+1,isNaN(a)&&(a=0),n.children().last().before('\n			<li data-type="tab" data-id="'+a+'" class="tab" style="opacity: 0.5;">'+e.name+"</li>\n		"),l.find('[data-type="tab"]').filter('[data-id="'+a+'"]').animate({opacity:1},300,"swing"),i.children().last().before('\n			<box data-type="obj" data-id="'+a+'" data-template-id="'+e.id+'" class="tabobj">\n				<div class="template-container">\n					<div class="container">\n						<input type="text" class="template-name" data-type="template-name" placeholder="Template name" value="'+e.name+'" required>\n					</div>\n					<hr>\n					<div style="position: relative;overflow: hidden;">\n						<div data-type="document" data-id="{{i}}" class="template-document" style="opacity: 0.25;padding: 10mm 0;">\n							'+e.body+'\n						</div>\n						<div data-type="template-hud" class="template-hud">\n							<div class="play-container" style="padding-right: 50mm;">\n								<div data-type="previous" class="play-padding">\n									<div class="play-left"></div>\n								</div>\n							</div>\n							<div class="play-container" style="padding-left: 50mm;">\n								<div data-type="next" class="play-padding">\n									<div class="play-right"></div>\n								</div>\n							</div>\n						</div>\n					</div>\n				</div>\n			</box>\n		'),o(),Paperwork.send("tab."+t.name+".activate",a)}function n(t){function e(){$.post(c.update,{id:n,direction:t}).done(function(t){t=JSON.parse(t),l.find('.tabopen [data-type="document"]').html(t.body).css({opacity:0,marginLeft:a+"px"}).animate({opacity:1,marginLeft:0},100,"swing"),o()})}var a,n=l.find(".tabopen").data("template-id");a="previous"==t?"-10":"10",l.find('.tabopen [data-type="document"]').animate({opacity:0,marginLeft:-1*a+"px"},100,"swing",e)}function i(){$.get(c.get).done(function(t){t=JSON.parse(t),s=t,o()})}function d(){l.on("keyup",'[data-type="properties"] .prop',function(){var t,e=$(this).closest('[data-type="row"]').find('[data-type="key"]').text().trim();t=m.toText($(this)),s[e]=t.html().trim(),p()}),l.on("blur",'[data-type="properties"] .prop',function(){var t=$(this).closest('[data-type="row"]').find('[data-type="key"]').text().trim();$(this).html(s[t]),o()})}function o(){Paperwork.send("document.template.reload",s)}function p(){clearTimeout(r),r=setTimeout(function(){$.post(c.putProp,{properties:s})},500)}var r,l=t.element,s={},c={get:environment.root+"/get/template-properties",update:environment.root+"/post/update-template",post:environment.root+"/post/template","delete":environment.root+"/delete/template",putProp:environment.root+"/put/properties",putTemplate:environment.root+"/put/template"},m=t.require("parse");t.use("tab"),t.use("document"),e(),i()});