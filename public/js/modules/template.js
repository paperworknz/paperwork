"use strict";Core.addModule("template",function(t){function e(){for(var t in y){var e=y[t];s.find(".color-palette").append('<div class="color" data-color="'+e+'" style="background-color: '+e+'"></div>')}}function a(){var t={select:s.find(".template-icon"),"delete":s.find(".template-delete"),create:s.find('[data-type="template-create"]'),update:s.find('[data-type="properties-update"]')};for(var e in t)t[e].off();s.find('[data-type="template-name"]').on("keyup",function(){var t=$(this).closest('[data-type="obj"]').data("id");p(),"+"!=t&&s.find('[data-type="tab-container"] [data-id="'+t+'"]').html($(this).val())}),s.find('[data-type="template-name"]').on("change",function(){var t=$(this).closest("[data-template-id]").data("template-id"),e=$(this).val().trim();$.post(f.putTemplate,{id:t,name:e}).done(function(t){p(),Paperwork.send("notification")})}),t.create.on("click",function(){var t=s.find('.new-template [data-type="new-template-name"]').val().trim();$.post(f.post,{name:t}).done(function(t){var e=JSON.parse(t);s.find('.new-template [data-type="new-template-name"]').val(""),n({id:e.id,name:e.name,body:e.body}),Paperwork.ready(s.find('[data-type="template-create"]'),"CREATE")})}),Paperwork.validate(s.find(".new-template"),t.create,Paperwork.random(6),{allowDuplicates:!0}),s.on("click",'[data-type="previous"]',function(){i("previous")}),s.on("click",'[data-type="next"]',function(){i("next")}),s.on("mouseover",'[data-type="row"]',function(){var t=$(this).find('[data-type="key"]').text().trim();-1==t.indexOf("colour")&&s.find('[data-property="'+t+'"]').css("background-color","#D6EDFF")}),s.on("mouseout",'[data-type="row"]',function(){var t=$(this).find('[data-type="key"]').text().trim();-1==t.indexOf("colour")&&s.find('[data-property="'+t+'"]').css("background-color","")}),s.on("click",".color-palette .color",function(){var t=$(this).data("color"),e=$(this).closest('[data-type="row"]').find('[data-type="key"]').text().trim();$(this).closest('[data-type="row"]').find(".prop").html(t),m[e]=t,r(),p()}),d()}function n(e){var a,n=s.find('[data-type="tab-container"] ul'),i=s.find('[data-type="obj-container"]');a=n.children().last().prev().data("id")+1,isNaN(a)&&(a=0),n.children().last().before('\n			<li data-type="tab" data-id="'+a+'" class="tab" style="opacity: 0.5;">'+e.name+"</li>\n		"),s.find('[data-type="tab"]').filter('[data-id="'+a+'"]').animate({opacity:1},300,"swing"),i.children().last().before('\n			<box data-type="obj" data-id="'+a+'" data-template-id="'+e.id+'" class="tabobj">\n				<div class="template-container">\n					<div class="container">\n						<input type="text" class="template-name" data-type="template-name" placeholder="Template name" value="'+e.name+'" required>\n					</div>\n					<hr>\n					<div style="position: relative;overflow: hidden;">\n						<div data-type="document" data-id="{{i}}" class="template-document" style="opacity: 0.25;padding: 10mm 0;">\n							'+e.body+'\n						</div>\n						<div data-type="template-hud" class="template-hud">\n							<div class="play-container" style="padding-right: 50mm;">\n								<div data-type="previous" class="play-padding">\n									<div class="play-left"></div>\n								</div>\n							</div>\n							<div class="play-container" style="padding-left: 50mm;">\n								<div data-type="next" class="play-padding">\n									<div class="play-right"></div>\n								</div>\n							</div>\n						</div>\n					</div>\n				</div>\n			</box>\n		'),p(),Paperwork.send("tab."+t.name+".activate",a)}function i(t){function e(){$.post(f.update,{id:n,direction:t}).done(function(t){t=JSON.parse(t),s.find(".tabopen .document-owner").css("width","auto"),s.find('.tabopen [data-type="document"]').html(t.body).css({opacity:0,marginLeft:a+"px",overFlow:"auto"}).animate({opacity:1,marginLeft:0},100,"swing"),p()})}var a,n=s.find(".tabopen").data("template-id");a="previous"==t?"-10":"10",s.find(".tabopen .document-owner").css("width",s.find(".tabopen .document-owner").outerWidth()),s.find('.tabopen [data-type="document"]').animate({opacity:0,marginLeft:-1*a+"px"},100,"swing",e).css("overflow","hidden")}function o(){$.get(f.get).done(function(t){t=JSON.parse(t),m=t,p()})}function d(){s.on("keyup",'[data-type="properties"] .prop',function(){var t,e=$(this).closest('[data-type="row"]').find('[data-type="key"]').text().trim();t=u.toText($(this)),m[e]=t.html().trim(),r(),p()}),s.on("blur",'[data-type="properties"] .prop',function(){var t=$(this).closest('[data-type="row"]').find('[data-type="key"]').text().trim();$(this).html(m[t]),p()}),s.on("change",'[data-type="properties"] [type="file"]',function(){var t=new FileReader,e=$(this).get(0).files[0];e&&(t.readAsDataURL(e),t.onload=function(t){l=null,m.image_size=null,m.image=t.target.result,r(),p(),l&&(m.image_size=l,s.find('[data-type="image_size"] .prop').html(l),s.find('[data-type="properties"] [type="range"]').get(0).value=l)})}),s.on("input",'[data-type="properties"] [type="range"]',function(){var t;t=$(this).val(),t=u.toNumber(t,{decimal:0}),$(this).parent().find(".prop").html(t),m.image_size=t,r(),p()})}function p(){Paperwork.send("document.template.reload",m),s.find(".template-logo").length&&(l=s.find(".template-logo").get(0).naturalWidth),l&&(s.find('[data-type="properties"] [type="range"]').get(0).max=l)}function r(){clearTimeout(c),c=setTimeout(function(){$.post(f.putProp,{properties:m})},500)}var l,c,s=t.element,m={},f={get:environment.root+"/get/template-properties",post:environment.root+"/post/template","delete":environment.root+"/delete/template",putProp:environment.root+"/put/properties",putTemplate:environment.root+"/put/template",update:environment.root+"/post/update-template"},u=t.require("parse");t.use("tab"),t.use("document");var y=["#1abc9c","#16a085","#2ecc71","#27ae60","#3498db","#2980b9","#9b59b6","#8e44ad","#34495e","#2c3e50","#f1c40f","#f39c12","#e67e22","#d35400","#e74c3c","#c0392b","#ecf0f1","#bdc3c7","#95a5a6","#7f8c8d","white","black"];e(),a(),o()});