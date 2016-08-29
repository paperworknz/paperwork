"use strict";function _defineProperty(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol?"symbol":typeof t};Core.addModule("job",function(t){function e(){Paperwork.on("document.new",function(t){return"object"!==("undefined"==typeof t?"undefined":_typeof(t))||null===t?console.warn("New document request not an object"):void s(t)})}function n(){f.on("click",'[data-type="save-button"]',function(){var t=f.find('.tabopen [data-type="document"]').data("id");Paperwork.send("document.job.save",t)})}function o(){Paperwork.wait(f.find(".pdf-load")),$.get(y.getPDFList).done(function(t){if("0"==t)return void f.find(".pdf-load").closest("tr").remove();t=JSON.parse(t),f.find(".pdf-load").remove(),f.find(".pdf-title").html("Paper");for(var e in t){var n=t[e];f.find(".pdf-list").append('\n					<div style="height:24px;line-height:24px">\n						<a target="_blank" href="'+environment.root+"/get/pdf/"+job.job_number+"/"+n+'" onclick="event.stopPropagation();">'+n+"</a>\n					</div>\n				")}})}function a(){f.on("click",'[data-type="client"]',function(){t.load("client",job.client_number)}),f.on("click",'[data-type="email"]',function(){t.load("email",{address:job.client_email})})}function i(){f.on("click",".note-wrap",function(){f.find(".notepad").focus()}),f.on("blur",".notepad",function(){var t;t=j.toText($(this)),$.post(y.put,{notes:t.html().trim(),id:job.job_id}).done(function(t){Paperwork.send("notification")})})}function d(){f.on("change",".status",function(){void 0!=$(this).val()&&$.post(y.put,{id:job.job_id,status:$(this).val()}).done(function(t){return"0"==t?Paperwork.send("notification","Failed to change"):void Paperwork.send("notification","Saved")})})}function r(){f.on("change",".job-name",function(){""!=$(".job-name").val()&&$.post(y.put,{name:$(".job-name").val().trim(),id:job.job_id}).done(function(t){Paperwork.send("notification","Saved")})})}function c(){f.on("click",'[data-type="job-delete-button"]',function(){var t={name:$(this).text().trim(),element:$(this)};swal({title:"Are you sure you want to delete this job?",text:"Deleting this job will delete ALL quotes and invoices attached",showCancelButton:!0,closeOnConfirm:!0},function(e){return e?void f.find('[data-type="delete-job"]').submit():Paperwork.ready(t.element,t.name)})})}function u(){f.on("click",'[data-type="copy-button"]',function(){var e=f.find('.tabopen [data-type="document"]').data("id"),n=h.documents(e);t.load("document-copy",{job_id:job.job_id,job_number:job.job_number,document_id:e,documents:n})}),f.on("click",'[data-type="margin-button"]',function(){var e=f.find('.tabopen [data-type="document"]').data("id"),n=h.documents(e);t.load("document-margin",{document_id:e,documents:n})}),f.on("click",'[data-type="pdf-button"]',function(){var t=l(),e=job.job_number;v.post({directory:e,document_html:t.document_html,document_name:t.document_name},function(t){return t?(Paperwork.ready(f.find('[data-type="pdf-button"]'),"PDF"),void Paperwork["goto"](t.location+"?view=attachment",!1)):swal({title:"Sorry, something went wrong",text:"Please try again!",type:"error",closeOnConfirm:!1},function(){Paperwork["goto"]("reload")})})}),f.on("click",'[data-type="email-button"]',function(){var e=(f.find('.tabopen [data-type="document"]').data("id"),job.job_id,job.job_number),n=l();Paperwork.wait(f.find('.tabopen [data-type="pdf-button"]')),v.post({directory:e,document_html:n.document_html,document_name:n.document_name},function(e){return Paperwork.ready(f.find('.tabopen [data-type="pdf-button"]'),"PDF"),e?void t.load("email",{address:job.client_email,attachments:_defineProperty({},n.document_name,e.location)}):swal({title:"Sorry, something went wrong",text:"We couldn't generate a PDF. Please try again!",type:"error",closeOnConfirm:!1},function(){Paperwork["goto"]("reload")})})})}function l(){var t=f.find('.tabopen [data-type="document"]').html(),e=f.find('.tabopen [data-type="document"] [data-template]').data("template"),n=f.find('[data-type="tab"].active').data("id"),o=f.find('[data-type="tab"].active').html().toLowerCase(),a=job.job_number+"_"+n+"-"+o;return t='\n		<!DOCTYPE html>\n		<html lang=\'en\'>\n			<head>\n				<meta charset="utf-8">\n				<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">\n				<meta name="format-detection" content="telephone=no">\n				<link rel="stylesheet" type="text/css" href="'+environment.root+'/css/library/Document.css">\n				<link rel="stylesheet" type="text/css" href="'+environment.root+"/css/templates/"+e+'.css">\n				<style>\n					doc-body {\n						letter-spacing: -1px;\n					}\n					[data-type="inventory-input"] {\n						display: none!important;\n					}\n				</style>\n			</head>\n			<body>\n				'+t+"\n			</body>\n		</html>\n		",{document_html:t,document_name:a}}function m(){f.on("click",'[data-type="document-delete-button"]',function(){var e=f.find('.tabopen [data-type="document"]').data("id"),n={name:$(this).text().trim(),element:$(this)};swal({title:"Are you sure you want to delete this document?",text:"You can undo this later",showCancelButton:!0,closeOnConfirm:!0},function(o){return o?void $.post(y["delete"],{id:e}).done(function(e){var n=f.find('[data-type="tab-container"] .active').data("id");Paperwork.send("tab."+t.name+".remove",n)}):Paperwork.ready(n.element,n.name)})})}function p(){f.on("click",'[data-type="new-document"]',function(){var t=$(this).data("template-id"),e=job.client_id,n=job.job_id;({name:$(this).text().trim(),element:$(this)});s({job_id:n,client_id:e,template_id:t})})}function s(t){$.post(y.post,{job_id:t.job_id,template_id:t.template_id,document:t.document}).done(function(e){return e=JSON.parse(e),t.job_number&&t.job_number!=job.job_number?Paperwork["goto"](environment.root+"/job/"+t.job_number+"?activate=last"):void b({name:t.name||e.name,body:t.body||e.body,document:e.document})})}function b(e){var n,o=f.find('[data-type="tab-container"] ul'),a=f.find('[data-type="obj-container"]');n=o.children().last().prev().data("id")+1,o.children().last().before('\n			<li data-type="tab" data-id="'+n+'" class="tab" style="opacity: 0.5;">\n				'+e.name+"\n			</li>\n		"),f.find('[data-type="tab"]').filter('[data-id="'+n+'"]').animate({opacity:1},300,"swing"),a.children().last().before('\n			<part data-type="obj" data-id="'+n+'" class="tabobj">\n				'+e.body+"\n			</part>\n		"),Paperwork.send("tab."+t.name+".activate",n),Paperwork.send("document.build",e.document)}var f=t.element,y={post:environment.root+"/post/document","delete":environment.root+"/delete/document",put:environment.root+"/put/job",getPDFList:environment.root+"/get/pdf-json/"+job.job_number},v=t.require("pdf"),j=t.require("parse"),h=t.use("document");t.use("tab");o(),a(),i(),d(),r(),c(),u(),n(),m(),p(),e()});