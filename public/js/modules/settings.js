"use strict";Core.addModule("settings",function(t){function n(){p.on("keyup",'[data-type="address"]',function(){var t=v.toText($(this));p.find('.user-details input[name="address"]').val(t.html().trim())})}function a(){new Sortable(document.getElementById("job-status"),{handle:".status-handle",animation:150,ghostClass:"status-hover",onEnd:o}),m.on("click",'[data-type="new-status"]',e),m.on("change",".jobstatus ul input",o)}function e(){m.find(".jobstatus ul").append('\n			<li>\n				<input type="text" placeholder="Status name" />\n				<div class="status-handle">\n				</div>\n			</li>\n		')}function o(){var t=[];m.find(".jobstatus ul input").each(function(){return void 0==$(this).data("id")?($(this).val()&&t.push({name:$(this).val()}),!0):void($(this).val()&&t.push({id:$(this).data("id"),name:$(this).val()}))}),$.post(h.status.post,{data:t}).done(function(){Paperwork.send("notification","Saved")})}function i(){y.on("blur",".email-address",function(){var t=$(this).val(),n=y.find(".email-settings input[name=smtp]"),a=y.find(".email-settings input[name=protocol]"),e=y.find(".email-settings input[name=port]");-1!=t.indexOf("@gmail")&&(n.val("smtp.gmail.com"),a.val("TLS"),e.val("587")),-1==t.indexOf("@hotmail")&&-1==t.indexOf("@live")||(n.val("smtp.live.com"),a.val(""),e.val("465")),-1!=t.indexOf("@outlook")&&(n.val("smtp-mail.outlook.com"),a.val("TLS"),e.val("587"))}),y.on("click",".email-signature button",function(){$.post(h.email.put,{signature:y.find(".signature").html()}).done(function(){Paperwork["goto"](environment.root+"/"+environment.page)})})}function s(){f.on("click",'[data-type="trash"]',function(){var t=$(this).data("id"),n=$(this).data("item");t&&n&&r(t,n)}),f.on("click",'[data-type="empty-trash"]',u)}function r(t,n,a){f.css("opacity",.5),f.attr("disabled",""),$.post(h.trash.put,{id:t,type:n}).done(function(e){f.css("opacity",1),f.removeAttr("disabled"),f.find('[data-item="'+n+'"][data-id="'+t+'"]').parent().remove(),a&&a()})}function u(){f.css("opacity",.5),f.attr("disabled",""),$.post(h.trash.post).done(function(t){Paperwork["goto"](environment.root+"/"+environment.page)})}function c(){return annyang?localStorage.annyang&&"true"===localStorage.annyang?(p.find('[data-type="annyang"]').append('\n			<part class="container">\n				Voice control is currently enabled.\n			</part>\n			<part class="container">\n				<button data-type="annyang-switch" class="button delete">Disable</button>\n			</part>\n		'),l()):(localStorage.annyang="false",p.find('[data-type="annyang"]').append('\n				<part class="container">\n					Voice control is currently disabled.\n				</part>\n				<part class="container">\n					<button data-type="annyang-switch" class="button">Enable</button>\n				</part>\n			'),l()):p.find('[data-type="annyang"]').append('\n				<part class="container">\n					Your browser has not adopted the Speech Recognition standard yet - sorry!\n				</part>\n			')}function l(){p.on("click",'[data-type="annyang-switch"]',function(){localStorage.annyang=$(this).hasClass("delete")?"false":"true",Paperwork["goto"](environment.root+"/"+environment.page)})}function d(){p.on("click",'[data-type="cancel-account"]',function(){var t={element:$(this),name:$(this).text()};swal({type:"warning",title:"Are you sure you want to cancel your account?",text:"We're sorry to see you go, but we understand businesses move on. Please make sure you have \n				read and understood what happens to your account when you cancel your subscription. We wish you \n				nothing but the best with your future endeavours!",showCancelButton:!0,closeOnConfirm:!1,showLoaderOnConfirm:!0},function(n){return n?void $.post(h.account.cancel).done(function(n){return n=JSON.parse(n),console.log(n),"error"==n.type?(Paperwork.ready(t.element,t.name),swal({type:"error",title:"We ran into a problem",text:n.message})):Paperwork["goto"](environment.root+"/get/logout")}):Paperwork.ready(t.element,t.name)})})}var p=t.element,m=(p.find('[data-type="account-container"]'),p.find('[data-type="job-container"]')),y=p.find('[data-type="email-container"]'),f=p.find('[data-type="trash-container"]'),h={status:{post:environment.root+"/post/status"},email:{put:environment.root+"/put/email-signature"},trash:{put:environment.root+"/put/restore",post:environment.root+"/post/empty-trash"},account:{cancel:environment.root+"/post/cancel"}},v=t.require("parse");t.use("tab"),n(),a(),i(),s(),c(),d()});