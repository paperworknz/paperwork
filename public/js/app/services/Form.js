"use strict";var Form=function(){var t=this;t.pw=Paperwork,t.tab=tab,t.p=new Painter,t.s="."+t.tab.activeObj,t.form="[form-blob]",t.map={},$.get(environment.root+"/get/inventory",function(e){$.get(environment.root+"/get/form/"+environment.job_id,function(n){var i=[],a=JSON.parse(n);$.each(a,function(t,e){$.each(e.items,function(e,n){void 0!=n.margin&&0!=n.margin||(a[t].items[e].margin="1")})}),t.inv=JSON.parse(e),$.each(t.inv,function(t,e){i.push(t)}),t.typeahead=new Typeahead(i),$(t.form).each(function(){var e=$(this),n=e.attr("data-formid");void 0!=a[n]||null!=a[n]?t.map[n]=a[n]:t.crawl(e),t.construct(e)})})})};Form.prototype.append=function(t,e,n,i){var a=this,e=void 0!==e?e:"",n=void 0!==n?n:"",i=void 0!==i?i:"",o=($(t).attr("data-formid"),a.p.get("latest-item-id",t)),r=!1;void 0===o&&(o=0),o=Number(o)+1,a.inv[e]&&""===i&&(i=r=a.inv[e]),e||(e=i=""),"0.00"==i&&(i=""),a.p.append(t,{itemID:o,item:e,quantity:n,price:i}),13==event.which&&event.preventDefault(),r===!1&&void 0!=e&&swal({html:!0,title:"Add "+e+" to your inventory?",text:"If you save this item you can use it again in future.",showCancelButton:!0,closeOnConfirm:!0,cancelButtonText:"No",confirmButtonText:"Yes"},function(){$.post(environment.root+"/post/inv",{name:e,price:"0.00"})}),$(".typeahead").typeahead("val",""),a.p["do"]("focus-last-item-quantity",t),a.update(t)},Form.prototype.construct=function(t){var e=this,n=t.attr("data-formid");e.refresh(t),$.each(e.map[n].items,function(n,i){e.p.append(t,{itemID:i.itemID,item:i.item,quantity:i.quantity,price:i.price})}),e.update(t),t.css("pointer-events","auto"),t.animate({opacity:1},500)},Form.prototype.crawl=function(t){var e=this,n=t.attr("data-formid"),i={};void 0!=e.map[n]&&$.each(e.map[n].items,function(t,e){void 0!==e.margin||0==e.margin?i[t]=e.margin:i[t]="1"}),e.map[n]={items:{},subtotal:0,tax:0,total:0},e.p.each("item",t,function(t){void 0===e.map[n].items[t.itemID]&&(e.map[n].items[t.itemID]={}),e.map[n].items[t.itemID].itemID=t.itemID,e.map[n].items[t.itemID].item=t.item,e.map[n].items[t.itemID].quantity=t.quantity,e.map[n].items[t.itemID].price=t.price,e.map[n].items[t.itemID].total=t.total,void 0!=i[t.itemID]&&(e.map[n].items[t.itemID].margin=i[t.itemID])}),e.map[n].subtotal=e.p.get("subtotal",t),e.map[n].tax=e.p.get("tax",t),e.map[n].total=e.p.get("total",t)},Form.prototype.dark=function(t){t.off().unbind()},Form.prototype.populate=function(t,e){var n=this;n.p.set("date",t,e.date),n.p.set("jobID",t,e.job_number),n.p.set("client",t,e.client)},Form.prototype.refresh=function(t){var e=this;e.dark(t),$(e.tab.objParent).on("change",function(){e.update(t)}),e.p.on("qty",$(e.tab.objParent),"input",function(){e.update(t)}),e.p.on("price",$(e.tab.objParent),"blur",function(){e.update(t)}),e.p.on("price",$(e.tab.objParent),"input",function(t){13==t.event.keyCode&&(t.event.preventDefault(),t.element.blur())}),t.on("click",".twig-remove",function(){e.p["do"]("this-remove-item",$(this)),e.update(t)}),e.p.initialiseTypeahead(t,function(){e.typeahead.run(t)}),t.bind("typeahead:select",".typeahead",function(){return 13==event.which?void 0:void e.append(t,$(e.s).find(".tt-input").val())}),t.on("keydown",".typeahead",function(){13==event.which&&e.append(t,$(e.s).find(".tt-input").val())})},Form.prototype.strip=function(t){var e=this,n=t.clone();return n=e.p.strip(n),n.html()},Form.prototype.update=function(t){var e=this,n=$(t).attr("data-formid"),i=0,a=function(t){return t.toFixed(2)},o=function(t){return t.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")};e.p.each("item",t,function(r){var p=r.itemID,l=(r.name,r.quantity.replace(",","")),c=r.price.replace("$","").replace(",",""),m=a(Number(c)),d=a(Number(l)*m);i+=Number(d),c=m>0?m:c,e.p["do"]("price-by-ID",t,{itemID:p,val:"$"+o(c)}),e.p["do"]("total-by-ID",t,{itemID:p,val:"$"+o(d)}),void 0!=e.map[n].items[p]&&c!=e.map[n].items[p].price.replace("$","").replace(",","")&&0==$(".margin-content").length&&(e.map[n].items[p].margin=1)});var r=a(i),p=a(3*i/2/10),l=a(Number(r)+Number(p));e.p.set("subtotal",t,"$"+o(r)),e.p.set("tax",t,"$"+o(p)),e.p.set("total",t,"$"+o(l)),e.crawl(t),void 0!=e.p.update&&e.p.update(t)},Form.prototype.copy=function(t,e){var n=this,i=t.attr("data-formid");t.find($(n.p.get("form-content",t)));n.dark(t);var a=Paperwork.dark(),o=(a.object,a.object.find(".dark_object"));o.after('\n		<div class="copy-content">\n			<div class="copy-parent wrapper">\n				<div style="text-align:center;font-size:20px;line-height:20px;padding:15px 0px">\n					Use template:\n				</div>\n			</div>\n		</div>\n	'),$.each(e,function(t,e){$(".copy-content .copy-parent").append('\n			<div class="new-template" data-templateid="'+t+'">\n				'+e+"\n			</div>\n		")}),$(".copy-content .copy-parent").append('\n		<button copy-cancel class="wolfe-btn blue pull-right" style="margin:5px 5px 0px 0px;">\n			CANCEL\n		</button>\n	'),$(".copy-content").css({top:$(window).height()/2-$(".copy-content").height()/2}),a.run(function(){$(".copy-content").animate({opacity:1},100)}),$(".copy-content .new-template").on("click",function(){var e={client:n.p.get("client",t),jobd:n.p.get("jobd",t),content:n.map[i]},o=$(this).html(),r=$(this).attr("data-templateid");a.remove(function(){$(".copy-content").off().unbind().remove(),n.refresh(t),n.update(t)}),n.post({url:environment.root+"/post/form",template_name:o,template_id:r,client_id:environment.client_id,job_id:environment.job_id,job_number:environment.job_number},function(t){var a=t.attr("data-formid");$.each(n.map[i].items,function(e,i){n.p.append(t,{itemID:i.itemID,item:i.item,quantity:i.quantity,price:i.price})}),n.construct(t),$.each(n.map[a].items,function(t,e){n.map[a].items[t].margin=n.map[i].items[t].margin}),n.p.set("client",t,e.client),n.p.set("jobd",t,e.jobd),n.put({url:environment.root+"/put/form",id:a})})}),$(".copy-content [copy-cancel]").on("click",function(){n.update(t),$(".copy-content").fadeOut(100,function(){a.remove(function(){$(".copy-content").off().unbind().remove(),n.refresh(t),n.update(t)})})}),o.on("click",function(){n.update(t),$(".copy-content").fadeOut(100,function(){a.remove(function(){$(".copy-content").off().unbind().remove(),n.refresh(t),n.update(t)})})})},Form.prototype.email=function(t){var e,n,i=this,a=(t.attr("data-formid"),t.find($(i.p.get("form-content",t))),0);n=localStorage&&void 0!=localStorage.ep?localStorage.ep:null,e=$(".email-signature-raw").html(),i.dark(t);var o=Paperwork.dark(),r=(o.object,o.object.find(".dark_object"));r.after('\n		<div class="email-content">\n			<div class="email-parent wrapper">\n				<input class="email-email" type="text" style="width:50%" value="'+environment.client_email+'" placeholder="Email Address" required />\n				<input class="email-subject" type="text" placeholder="Subject Line" required />\n				<div class="email-body" style="padding:4px;width:100%;height:300px;border:1px solid #ccc;overflow-y:auto" contenteditable>\n					<br>\n					'+e+'\n				</div>\n				<i>PDF attached</i>\n				<div class="wrapper">\n					<button email-send class="wolfe-btn pull-right">SEND</button>\n					<button email-cancel class="wolfe-btn blue pull-right" style="margin-right:5px">CANCEL</button>\n					<input class="email-password pull-right" type="password" name="password" \n						style="height:37px;line-height:37px;width:25%;margin-right:5px" placeholder="Email Password" required />\n				</div>\n			</div>\n		</div>\n	'),$(".email-content").css({top:$(window).height()/2-$(".email-content").height()/2}),$(".email-content input[name=password]").val(n),o.run(function(){$(".email-content").animate({opacity:1},100)}),$(".email-content [email-send]").on("click",function(){$(".email-content .email-parent").addClass("no-click"),$(".email-content .email-parent").css("opacity","0.5"),$(".email-content .email-parent").append('\n			<div style="width:200px;height:123px;position:absolute;left:0;right:0;top:0;bottom:0;margin:auto;">\n				<img src="'+environment.root+'/css/app/media/plane.gif" width="200px" />\n			</div>\n		');var e,n,r=$(".email-email").val(),p=$(".email-subject").val(),l=$(".email-body").html(),c=$(".email-password").val();i.pdf($(i.s).find(i.form),function(t,i){e=t,n=i}),$.post(environment.root+"/post/email",{job_number:environment.job_number,name:e,html:n,client_name:environment.client_name,address:r,subject:p,body:l,password:c}).done(function(e){if("OK"==e)$(".email-content .email-parent").css("opacity","0"),$(".email-content").append('\n					<div style="width:95px;position:absolute;left:0;right:0;top:165px;margin:auto;">\n						<video autoplay>\n							<source src="'+environment.root+'/css/app/media/success.webm" type="video/webm">\n						</video>\n					</div>\n				'),setTimeout(function(){$(".email-content").fadeOut(100,function(){o.remove(function(){$(".email-content").off().unbind().remove(),i.refresh(t),i.update(t)})})},1500),localStorage.ep=c;else if("Password"==e){var n=void 0;n=a>1?'Do you need to <a href="'+environment.root+'/settings" target="_blank">update your password</a> in Paperwork?':"Wrong password",$(".email-content .email-parent").removeClass("no-click"),$(".email-content .email-parent").css("opacity","1"),$(".email-content .wait").remove(),$(".email-content [wrong-password]").remove(),$(".email-content .email-password").after('\n					<div wrong-password style="color:red;line-height:37px;padding-right:5px" class="pull-right">\n						'+n+"\n					<div>\n				"),a++}else $(".email-content .email-parent").css("opacity","0"),$(".email-content").append('\n					<div style="text-align:center;position:absolute;left:0;right:0;top:78px;margin:auto;">\n						There was a problem sending this email.<br>\n						Please make sure your email settings are correct, otherwise email hello@paperwork.nz for support.\n					</div>\n				')}).fail(function(){$(".email-content .email-parent").css("opacity","0"),$(".email-content").append('\n				<div style="text-align:center;position:absolute;left:0;right:0;top:78px;margin:auto;">\n					There was a problem sending this email.<br>\n					Please make sure your email settings are correct, otherwise email hello@paperwork.nz for support.\n				</div>\n			')})}),$(".email-content [email-cancel]").on("click",function(){$(".email-content").fadeOut(100,function(){o.remove(function(){$(".email-content").off().unbind().remove(),i.refresh(t),i.update(t)})})}),r.on("click",function(){""==$(".email-subject").val()&&0===$(".email-body").html().length&&$(".email-content").fadeOut(100,function(){o.remove(function(){$(".email-content").off().unbind().remove(),i.refresh(t),i.update(t)})})})},Form.prototype.pdf=function(t,e){var n=this,i=(t.attr("data-formid"),$("."+n.tab.activeTab)),a=t.clone();a=n.strip(a);var o=(environment.job_number+"_"+i.attr("data-tab")+"-"+i.html().trim().toLowerCase()).trim(),r="\n	<!DOCTYPE html>\n	<html lang='en'>\n	<head>\n		<meta name='viewport' content='width=device-width,initial-scale=1.0'>\n		<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css' type='text/css'>\n	</head>\n	<body>\n	"+a+"\n	</body>\n	";e(o,r)},Form.prototype.margin=function(t){var e=this,n=t.attr("data-formid"),i=(e.p.get("remove"),{}),a={},o=e.p.get("item-price"),r=t.find($(e.p.get("form-content",t))),p=function(t){return t.toFixed(2)},l=function(t){return t.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")};$.each(e.map[n].items,function(t,e){var n=t;i[n]={margin:e.margin,current:e.price,original:Number(e.price.replace("$","").replace(",",""))/e.margin}}),a={subtotal:Number(e.map[n].subtotal.replace("$","").replace(",","")),tax:Number(e.map[n].tax.replace("$","").replace(",","")),total:Number(e.map[n].total.replace("$","").replace(",",""))},e.dark(t);var c=Paperwork.dark(),m=c.object,d=c.object.find(".dark_object");d.after('\n		<div class="margin-content">\n			<div class="margin-parent">\n			</div>\n		</div>\n	'),$(".margin-content").css({top:r.offset().top-51,left:r.offset().left-30}),$.each(e.map[n].items,function(t,e){if("0.0"!==(100*e.margin-100).toFixed(1))var n=" ("+(100*e.margin-100).toFixed(1)+"%)";else var n="";l(p(i[t].original));$(".margin-content .margin-parent").append('\n			<div class="margin-item wrapper lowlight" item-id="'+t+'">\n				<input type="checkbox" style="float:left;margin-left:5px">\n				<div style="float:left;width:273px;overflow:hidden;white-space:nowrap;position:relative;margin-left:5px;margin-right:10px;height:24px;line-height:24px">'+e.item+'</div>\n				<div margin-qty style="float:left;width:58px;border-left:1px solid black;padding:0px 5px;text-align:center;height:24px;line-height:24px">'+e.quantity+'</div>\n				<div style="float:left;border-left:1px solid black;padding:0px 5px;width:230px;text-align:center;height:24px;line-height:24px;">\n					<span margin-price style="font-weight:600">'+e.price+"</span><span margin-percent>"+n+'</span>\n				</div>\n				<div margin-total style="float:left;border-left:1px solid black;text-align:left;height:24px;line-height:24px;padding-left:10px;">'+e.total+"</div>\n			</div>\n		")}),$(".margin-content").append('\n		<div class="wrapper" style="position:relative;">\n			<div class="wrapper">\n				<div class="ac" style="padding:10px 10px 0px 10px;">\n					<input cent style="width:60px;text-align:center" /> %\n				</div>\n				<div style="width:100%;padding:10px;">\n					<input range type="range" style="width:200px;margin:0 auto">\n				</div>\n			</div>\n			<div style="position:absolute;right:10px;top:0;border:1px solid black;">\n				<ul class="pull-left" style="text-align:right;padding:0;border-right:1px solid black;">\n					<li style="padding:2px 10px;">Sub Total</li>\n					<li style="padding:2px 10px;">GST</li>\n					<li style="padding:2px 10px;font-weight:600;">Total</li>\n				</ul>\n				<ul class="pull-left" style="text-align:left;padding:0;min-width:93px;">\n					<li margin-subtotal style="padding:2px 10px;">$'+l(p(a.subtotal))+'</li>\n					<li margin-tax style="padding:2px 10px;">$'+l(p(a.tax))+'</li>\n					<li margin-totalend style="padding:2px 10px;font-weight:600;">$'+l(p(a.total))+'</li>\n				</ul>\n			</div>\n		</div>\n		<div class="wrapper" style="padding:10px">\n			<button margin-apply class="wolfe-btn pull-right">APPLY</button>\n			<button margin-cancel class="wolfe-btn blue pull-right" style="margin-right:5px">CANCEL</button>\n		</div>\n	'),$(".margin-content [cent], .margin-content [range]").val(0),c.run(function(){$(".margin-content").animate({opacity:1},100)}),$(".margin-content [range], .margin-content [cent]").on("input",function(){$(".margin-content [cent]").val($(this).val()),$(".margin-content [range]").val($(this).val());var t=(Number(m.find("[cent]").val())+100)/100;m.find(".margin-item").each(function(){var e=$(this).attr("item-id");if($(this).find("input[type=checkbox]")[0].checked){var n=i[e].original,a=$(this).find("[margin-qty]").html().replace("$","").replace(",",""),o=l(p(n*t));$(this).find("[margin-price]").html("$"+o),$(this).find("[margin-percent]").html(" (+"+Number(100*t-100).toFixed(1)+"%)"),$(this).find("[margin-total]").html("$"+l(p(n*t*a))),i[e].current=o,i[e].margin=t}-1!==$(this).find("[margin-percent]").html().indexOf("(+0.0%)")&&$(this).find("[margin-percent]").html("")});var e=0;$(".margin-content [margin-total]").each(function(){e+=Number($(this).html().replace("$","").replace(",",""))}),e=p(e);var n=p(3*e/2/10),a=p(Number(e)+Number(n));$("[margin-subtotal]").html("$"+l(e)),$("[margin-tax]").html("$"+l(n)),$("[margin-totalend]").html("$"+l(a))}),$(".margin-content input:checkbox").on("change",function(){var t=$(this).closest("[item-id]");t.hasClass("lowlight")?t.removeClass("lowlight"):t.addClass("lowlight")}),$(".margin-content [margin-apply]").on("click",function(){t.find(o).each(function(){var t=e.p.get("this-item-id",$(this));e.map[n].items[t].margin=i[t].margin,$(this).html(i[t].current)}),e.refresh(t),e.update(t),e.put({url:environment.root+"/put/form",id:n}),$(".margin-content").fadeOut(100,function(){c.remove()})}),$(".margin-content [margin-cancel]").on("click",function(){e.update(t),$(".margin-content").fadeOut(100,function(){c.remove(function(){e.refresh(t),e.update(t)})})}),d.on("click",function(){e.update(t),$(".margin-content").fadeOut(100,function(){c.remove(function(){e.refresh(t),e.update(t)})})})},Form.prototype["delete"]=function(t,e){void 0!=t.url&&void 0!=t.form_id&&$.post(t.url,{id:t.form_id}).done(function(t){"0"!=t?void 0!=e&&e(!0):(void 0!=e&&e(!1),console.log("Form delete failed with Slim 0"))}).fail(function(){void 0!=e&&e(!1),console.log("Internal Server Error")})},Form.prototype.post=function(t,e){var n=this;void 0!=t.url&&void 0!=t.template_id&&void 0!=t.client_id&&void 0!=t.job_id&&void 0!=t.job_number&&$.post(t.url,{template_id:t.template_id,client_id:t.client_id,job_id:t.job_id}).done(function(i){var i=JSON.parse(i),a=n.tab.objParent,o=Number($(a).find("["+n.tab.heir+"]").attr(n.tab.objhook)),r=i.id;$(a).find("["+n.tab.heir+"]").before("\n				<div "+n.tab.objhook+'="'+o+'" class="'+n.tab.obj+' h">\n					'+i.html+"\n				</div>\n			"),$(a).find("["+n.tab.heir+"]").replaceWith("\n				<div "+n.tab.objhook+'="'+(o+1)+'" '+n.tab.heir+" hidden>\n				</div>\n			"),$("["+n.tab.objhook+'="'+o+'"]').find("[form-blob]").attr("data-formid",r);var p=$('[data-formid="'+r+'"]');n.crawl(p),n.tab.append(t.template_name,function(a){n.populate(p,{job_number:t.job_number,date:i.date,client:i.client}),n.put({url:environment.root+"/put/form",id:r},function(){n.construct(p),e(p)})})}).fail(function(){void 0!=e&&e(!1),console.log("Internal Server Error")})},Form.prototype.put=function(t,e){var n=this,i=$('[data-formid="'+t.id+'"]'),a=i.clone();n.p["do"]("flush-items",a);var o=n.strip(a);void 0!=t.url&&void 0!=t.id?$.post(t.url,{id:t.id,html:o,json:JSON.stringify(n.map[t.id])}).done(function(){"0"!=t?void 0!=e&&e(!0):(void 0!=e&&e(!1),console.log("Form put failed with Slim 0"))}).fail(function(){void 0!=e&&e(!1),console.log("Internal Server Error")}):console.log("URL or data.id not supplied, form not saved.")};