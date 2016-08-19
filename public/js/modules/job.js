"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol?"symbol":typeof t};Core.addModule("job",function(t){function e(){Paperwork.on("new-document",function(t){return"object"!==("undefined"==typeof t?"undefined":_typeof(t))||null===t?console.warn("New document request not an object"):void l(t)})}function n(){Paperwork.wait(m.find(".pdf-load")),$.get(f.getPDFList).done(function(t){if("0"==t)return void m.find(".pdf-load").closest("tr").remove();t=JSON.parse(t),m.find(".pdf-load").remove(),m.find(".pdf-title").html("Paper");for(var e in t){var n=t[e];m.find(".pdf-list").append('\n					<div style="height:24px;line-height:24px">\n						<a target="_blank" href="'+environment.root+"/get/pdf/"+job.job_number+"/"+n+'">'+n+"</a>\n					</div>\n				")}})}function o(){m.on("click",".note-wrap",function(){m.find(".notepad").focus()}),m.on("blur",".notepad",function(){$.post(f.put,{notes:$(this).html(),id:job.job_id}).done(function(t){Paperwork.send("notification")})})}function i(){m.on("change",".status",function(){void 0!=$(this).val()&&$.post(f.put,{id:job.job_id,status:$(this).val()}).done(function(t){return"0"==t?Paperwork.send("notification","Failed to change"):void Paperwork.send("notification","Saved")})})}function a(){m.on("change",".job-name",function(){""!=$(".job-name").val()&&$.post(f.put,{name:$(".job-name").val().trim(),id:job.job_id}).done(function(t){Paperwork.send("notification","Saved")})})}function d(){m.on("click",'[data-type="job-delete-button"]',function(){var t={name:$(this).text().trim(),element:$(this)};swal({title:"Are you sure you want to delete this job?",text:"Deleting this job will delete ALL quotes and invoices attached",showCancelButton:!0,closeOnConfirm:!0},function(e){return e?void m.find("[job-del-form]").submit():Paperwork.ready(t.element,t.name)})})}function r(){m.on("click",'[data-type="copy-button"]',function(){var e=m.find('.tabopen [data-type="document"]').data("id"),n=p.documents(e);t.load("document-copy",{job_id:job.job_id,job_number:job.job_number,client_id:job.client_id,document_id:e,document_data:n})})}function c(){m.on("click",'[data-type="document-delete-button"]',function(){var e=m.find('.tabopen [data-type="document"]').data("id"),n={name:$(this).text().trim(),element:$(this)};swal({title:"Are you sure you want to delete this document?",text:"You can undo this later",showCancelButton:!0,closeOnConfirm:!0},function(o){return o?void $.post(f["delete"],{id:e}).done(function(e){var n=m.find('[data-type="tab-container"] .active').data("id");Paperwork.send("tab."+t.name+".remove",n)}):Paperwork.ready(n.element,n.name)})})}function u(){m.on("click",'[data-type="new-document"]',function(){var t=$(this).data("template-id"),e=job.client_id,n=job.job_id;({name:$(this).text().trim(),element:$(this)});l({job_id:n,client_id:e,template_id:t})})}function l(t){$.post(f.post,{job_id:t.job_id,template_id:t.template_id,document:t.document}).done(function(e){return e=JSON.parse(e),t.job_number&&t.job_number!=job.job_number?Paperwork["goto"](environment.root+"/job/"+t.job_number+"?activate=last"):void b({name:t.name||e.name,body:t.body||e.body,document:e.document})})}function b(e){var n,o=m.find('[data-type="tab-container"] ul'),i=m.find('[data-type="obj-container"]');n=o.children().last().prev().data("id")+1,o.children().last().before('\n			<li data-type="tab" data-id="'+n+'" class="tab" style="opacity: 0.5;">\n				'+e.name+"\n			</li>\n		"),m.find('[data-type="tab"]').filter('[data-id="'+n+'"]').animate({opacity:1},300,"swing"),i.children().last().before('\n			<part data-type="obj" data-id="'+n+'" class="tabobj">\n				'+e.body+"\n			</part>\n		"),Paperwork.send("tab."+t.name+".activate",n),Paperwork.send("document."+t.name+".build",e.document)}var m=t.element,f={post:environment.root+"/post/document","delete":environment.root+"/delete/document",put:environment.root+"/put/job",getPDFList:environment.root+"/get/pdf-json/"+job.job_number},p=t.use("document");t.use("tab"),n(),o(),i(),a(),d(),r(),c(),u(),e()});