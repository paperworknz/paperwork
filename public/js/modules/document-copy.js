"use strict";Core.addModule("document-copy",function(e){function t(){d.on("keyup",'[data-type="job_number"]',a),d.on("keydown",'[data-type="job_number"]',a),d.on("blur",'[data-type="job_number"]',function(){var e=$(this).val().trim();return a(),e?void $.get(i.get+"/"+e).done(function(e){e=JSON.parse(e),"error"==e.type&&(d.find('[data-type="job_number"]').val("").removeClass("ok").addClass("error").blur(),setTimeout(function(){d.find('[data-type="job_number"]').removeClass("error")},500)),"success"==e.type&&(d.find('[data-type="job_number"]').addClass("ok"),d.find('[data-type="job_id"]').val(e.job_id).blur())}):void $(this).removeClass("ok")}),d.on("click",'[data-type="new-document"]',function(){var t=r.toNumber(d.find('[data-type="job_number"]').val()),a=r.toNumber(d.find('[data-type="job_id"]').val())||e.data.job_id,o=$(this).data("template-id");n({job_id:a,job_number:t,template_id:o})}),d.on("click",'[data-type="cancel-button"]',o)}function a(){d.find('[data-type="job_id"]').val("")}function o(){e.stop()}function n(t){delete e.data.documents.date,Paperwork.send("document.new",{job_id:t.job_id,job_number:t.job_number,template_id:t.template_id,document:e.data.documents}),o()}var d=e.element,r=e.require("parse"),i={get:environment.root+"/get/job"};t(),d.find('[data-type="job_number"]').val(e.data.job_number).attr("placeholder",e.data.job_number).blur(),Paperwork.validate(d.find(".copy-parent"),d.find('[data-type="new-document"]'),"document-copy")});