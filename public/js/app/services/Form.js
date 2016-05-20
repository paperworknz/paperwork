var Form=function(){var t=this;t.pw=pw,t.tab=tab,t.p=new Painter,t.s="."+t.tab.activeObj,t.form="[form-blob]",t.map={},$.get(environment.root+"/get/inv",function(e){$.get(environment.root+"/get/form/"+environment.job_id,function(i){var n=[],a=JSON.parse(i);$.each(a,function(t,e){$.each(e.items,function(e,i){void 0!=i.margin&&0!=i.margin||(a[t].items[e].margin="1")})}),t.inv=JSON.parse(e),$.each(t.inv,function(t,e){n.push(t)}),t.typeahead=new Typeahead(n),$(t.form).each(function(){var e=$(this),i=e.attr("data-formid");void 0!=a[i]||null!=a[i]?t.map[i]=a[i]:t.crawl(e),t.construct(e)})})})};Form.prototype.append=function(t,e,i,n){var a=this,e=void 0!==e?e:"",i=void 0!==i?i:"",n=void 0!==n?n:"",o=($(t).attr("data-formid"),a.p.get("latest-item-id",t)),r=!1;void 0===o&&(o=0),o=Number(o)+1,a.inv[e]&&""===n&&(n=r=a.inv[e]),e||(e=n=""),"0.00"==n&&(n=""),a.p.append(t,{itemID:o,item:e,quantity:i,price:n}),13==event.which&&event.preventDefault(),r===!1&&void 0!=e&&swal({html:!0,title:"Add "+e+" to your inventory?",text:"If you save this item you can use it again in future.",showCancelButton:!0,closeOnConfirm:!0,cancelButtonText:"No",confirmButtonText:"Yes"},function(){$.post(environment.root+"/post/inv",{name:e,price:"0.00"})}),$(".typeahead").typeahead("val",""),a.p["do"]("focus-last-item-quantity",t),a.update(t)},Form.prototype.construct=function(t){var e=this,i=t.attr("data-formid");e.refresh(t),$.each(e.map[i].items,function(i,n){e.p.append(t,{itemID:n.itemID,item:n.item,quantity:n.quantity,price:n.price})}),e.update(t),t.css("pointer-events","auto"),t.animate({opacity:1},500)},Form.prototype.crawl=function(t){var e=this,i=t.attr("data-formid"),n={};void 0!=e.map[i]&&$.each(e.map[i].items,function(t,e){void 0!==e.margin||0==e.margin?n[t]=e.margin:n[t]="1"}),e.map[i]={items:{},subtotal:0,tax:0,total:0},e.p.each("item",t,function(t){void 0===e.map[i].items[t.itemID]&&(e.map[i].items[t.itemID]={}),e.map[i].items[t.itemID].itemID=t.itemID,e.map[i].items[t.itemID].item=t.item,e.map[i].items[t.itemID].quantity=t.quantity,e.map[i].items[t.itemID].price=t.price,e.map[i].items[t.itemID].total=t.total,void 0!=n[t.itemID]&&(e.map[i].items[t.itemID].margin=n[t.itemID])}),e.map[i].subtotal=e.p.get("subtotal",t),e.map[i].tax=e.p.get("tax",t),e.map[i].total=e.p.get("total",t)},Form.prototype.dark=function(t){t.off().unbind()},Form.prototype.populate=function(t,e){var i=this;i.p.set("date",t,e.date),i.p.set("jobID",t,e.job_number),i.p.set("client",t,e.client)},Form.prototype.refresh=function(t){var e=this;e.dark(t),$(e.tab.objParent).on("change",function(){e.update(t)}),e.p.on("qty",$(e.tab.objParent),"input",function(){e.update(t)}),e.p.on("price",$(e.tab.objParent),"blur",function(){e.update(t)}),e.p.on("price",$(e.tab.objParent),"input",function(t){13==t.event.keyCode&&(t.event.preventDefault(),t.element.blur())}),t.on("click",".twig-remove",function(){e.p["do"]("this-remove-item",$(this)),e.update(t)}),e.p.initialiseTypeahead(t,function(){e.typeahead.run(t)}),t.bind("typeahead:select",".typeahead",function(){return 13==event.which?void 0:void e.append(t,$(e.s).find(".tt-input").val())}),t.on("keydown",".typeahead",function(){13==event.which&&e.append(t,$(e.s).find(".tt-input").val())});var i=$("."+e.tab.activeTab).attr(e.tab.tabhook),n=$("."+e.tab.activeTab).html();t.closest("."+e.tab.obj).find("[form-pdf-name]").val(i+"-"+n.toLowerCase())},Form.prototype.strip=function(t){var e=this,i=t.clone();return i=e.p.strip(i),i.html()},Form.prototype.update=function(t){var e=this,i=$(t).attr("data-formid"),n=0,a=function(t){return t.toFixed(2)},o=function(t){return t.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")};e.p.each("item",t,function(r){var p=r.itemID,d=(r.name,r.quantity.replace(",","")),c=r.price.replace("$","").replace(",",""),l=a(Number(c)),m=a(Number(d)*l);n+=Number(m),c=l>0?l:c,e.p["do"]("price-by-ID",t,{itemID:p,val:"$"+o(c)}),e.p["do"]("total-by-ID",t,{itemID:p,val:"$"+o(m)}),void 0!=e.map[i].items[p]&&c!=e.map[i].items[p].price.replace("$","").replace(",","")&&0==$("[margin]").length&&(e.map[i].items[p].margin=1)});var r=a(n),p=a(3*n/2/10),d=a(Number(r)+Number(p));e.p.set("subtotal",t,"$"+o(r)),e.p.set("tax",t,"$"+o(p)),e.p.set("total",t,"$"+o(d)),e.crawl(t),void 0!=e.p.update&&e.p.update(t)},Form.prototype.copy=function(t,e){var i=this,n=t.attr("data-formid");t.find($(i.p.get("form-content",t)));i.dark(t),$("#content").after("<div copy></div>"),$("[copy]").append('<div fade style="width:10000px;height:10000px;background-color:black;opacity:0.0;position:fixed;top:0;z-index:2;overflow:hidden;" disable></div>'),$("[fade]").after("<div copy-content></div>"),$("[copy-content]").css({position:"absolute","z-index":999,left:0,right:0,marginLeft:"auto",marginRight:"auto",width:"710px","background-color":"white",border:"none","min-height":"50px",opacity:"0.00"}),$("[copy-content]").html('<div copy-parent class="wrapper"><div style="text-align:center;font-size:20px;line-height:20px;padding:15px 0px">Use template:</div></div>'),$("[copy-parent]").css({margin:"10px"}),$.each(e,function(t,e){$("[copy-parent]").append('<div class="new-template" data-templateid="'+t+'">'+e+"</div>")}),$("[copy-parent]").append('<button copy-cancel class="wolfe-btn blue pull-right" style="margin-right:5px">CANCEL</button>'),$("[copy-content]").css({top:$(window).height()/2-$("[copy-content]").height()/2}),$("[fade]").animate({opacity:.66},150,function(){$("[copy] [copy-content]").animate({opacity:1},100)}),$("[copy] .new-template").on("click",function(){var e={client:i.p.get("client",t),jobd:i.p.get("jobd",t),content:i.map[n]},a=$(this).html(),o=$(this).attr("data-templateid");$("[fade]").fadeOut(150,function(){$("[copy]").off().unbind().remove(),i.refresh(t),i.update(t)}),i.post({url:environment.root+"/post/form",template_name:a,template_id:o,client_id:environment.client_id,job_id:environment.job_id,job_number:environment.job_number},function(t){$.each(i.map[n].items,function(e,n){i.p.append(t,{itemID:n.itemID,item:n.item,quantity:n.quantity,price:n.price})});var a=t.attr("data-formid");i.p.set("client",t,e.client),i.p.set("jobd",t,e.jobd),i.construct(t),i.put({url:environment.root+"/put/form",id:a})})}),$("[copy] [copy-cancel]").on("click",function(){i.update(t),$("[copy] [copy-content]").fadeOut(100,function(){$("[fade]").fadeOut(150,function(){$("[copy]").off().unbind().remove(),i.refresh(t),i.update(t)})})}),$("[fade]").on("click",function(){i.update(t),$("[copy] [copy-content]").fadeOut(100,function(){$("[fade]").fadeOut(150,function(){$("[copy]").off().unbind().remove(),i.refresh(t),i.update(t)})})})},Form.prototype.email=function(t){var e=this;t.attr("data-formid"),t.find($(e.p.get("form-content",t)));e.dark(t),$("#content").after("<div email></div>"),$("[email]").append('<div fade style="width:10000px;height:10000px;background-color:black;opacity:0.0;position:fixed;top:0;z-index:2;overflow:hidden;" disable></div>'),$("[fade]").after("<div email-content></div>"),$("[email-content]").css({position:"absolute","z-index":999,left:0,right:0,marginLeft:"auto",marginRight:"auto",width:"710px","background-color":"white",border:"none","min-height":"50px",opacity:"0.00"}),$("[email-content]").html('<style>.email-parent input {display:block;width:100%;border:1px solid #ccc;margin-bottom:10px;}</style><div email-parent class="email-parent wrapper"><input class="email-email" type="text" style="width:50%" value="'+environment.client_email+'" placeholder="Email Address" /><input class="email-subject" type="text" placeholder="Subject Line" /><div class="email-body" style="padding:4px;width:100%;height:125px;border:1px solid #ccc;overflow-y:auto" contenteditable></div><i>PDF attached</i></div>'),$("[email-parent]").css({margin:"10px"}),$("[email-parent]").append('<div class="wrapper"><button email-send class="wolfe-btn pull-right">SEND</button><button email-cancel class="wolfe-btn blue pull-right" style="margin-right:5px">CANCEL</button></div>'),$("[email-content]").css({top:$(window).height()/2-$("[email-content]").height()/2}),$("[fade]").animate({opacity:.66},150,function(){$("[email] [email-content]").animate({opacity:1},100)}),$("[email] [email-send]").on("click",function(){$("[email] [email-parent]").addClass("no-click"),$("[email] [email-parent]").css("opacity","0.5"),$("[email] [email-parent]").append('<div class="wait la-ball-fall" style="width:50px!important;position:absolute;left:0;right:0;top:120px;margin:auto;"><div style="background-color:#bbb"></div><div style="background-color:#bbb"></div><div style="background-color:#bbb"></div></div>');var i=$(".email-email").val(),n=$(".email-subject").val(),a=$(".email-body").html(),o="";e.pdf($(e.s).find("[form-blob]"),function(t){o=t});var r=$("."+e.tab.activeTab).attr(e.tab.tabhook),p=$("."+e.tab.activeTab).html(),d=r+"-"+p.toLowerCase();$.post(environment.root+"/post/email",{job_number:environment.job_number,file_name:d,html:o,client_name:environment.client_name,address:i,subject:n,body:a}).done(function(i){"OK"==i?($("[email] [email-parent]").css("opacity","0"),$("[email] [email-content]").append('<div style="width:95px;position:absolute;left:0;right:0;top:78px;margin:auto;"><video autoplay><source src="'+environment.root+'/inc/paperwork/success.webm" type="video/webm"></video></div>'),setTimeout(function(){$("[email] [email-content]").fadeOut(100,function(){$("[fade]").fadeOut(150,function(){$("[email]").off().unbind().remove(),e.refresh(t),e.update(t)})})},1500)):($("[email] [email-parent]").css("opacity","0"),$("[email] [email-content]").append('<div style="text-align:center;position:absolute;left:0;right:0;top:78px;margin:auto;">There was a problem sending this email.<br>Please make sure your email settings are correct, otherwise email hello@paperwork.nz for support.</div>'))}).fail(function(){$("[email] [email-parent]").css("opacity","0"),$("[email] [email-content]").append('<div style="text-align:center;position:absolute;left:0;right:0;top:78px;margin:auto;">There was a problem sending this email.<br>Please make sure your email settings are correct, otherwise email hello@paperwork.nz for support.</div>')})}),$("[email] [email-cancel]").on("click",function(){$("[email] [email-content]").fadeOut(100,function(){$("[fade]").fadeOut(150,function(){$("[email]").off().unbind().remove(),e.refresh(t),e.update(t)})})}),$("[fade]").on("click",function(){""==$(".email-subject").val()&&0===$(".email-body").html().length&&$("[email] [email-content]").fadeOut(100,function(){$("[fade]").fadeOut(150,function(){$("[email]").off().unbind().remove(),e.refresh(t),e.update(t)})})})},Form.prototype.pdf=function(t,e){var i=this,n=t.clone();n=i.strip(n);var a="<!DOCTYPE html><html lang='en'><head><meta name='viewport' content='width=device-width,initial-scale=1.0'><link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css' type='text/css'></head><body>"+n+"</body>";e(a)},Form.prototype.margin=function(t){var e=this,i=t.attr("data-formid"),n=(e.p.get("remove"),{}),a=e.p.get("item-price"),o=t.find($(e.p.get("form-content",t))),r=function(t){return t.toFixed(2)},p=function(t){return t.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")};$.each(e.map[i].items,function(t,e){var i=t,a=e.margin;n[i]={current:e.price,original:Number(e.price.replace("$","").replace(",",""))/a}}),e.dark(t),$("#content").after("<div margin></div>"),$("[margin]").append('<div fade style="width:10000px;height:10000px;background-color:black;opacity:0.0;position:fixed;top:0;z-index:2;overflow:hidden;" disable></div>'),$("[fade]").after("<div margin-content></div>"),$("[margin-content]").css({position:"absolute","z-index":999,top:o.offset().top-51,left:o.offset().left-30,width:"710px","background-color":"white",border:"none","min-height":"50px",opacity:"0.00"}),$("[margin-content]").html("<div margin-parent></div>"),$("[margin-parent]").css({margin:"10px",border:"1px solid black"}),$.each(e.map[i].items,function(t,e){$("[margin-parent]").append('<div class="margin-item wrapper lowlight" item-id="'+t+'"><input type="checkbox" style="float:left;margin-left:5px"><div style="float:left;width:285px;overflow:hidden;white-space:nowrap;position:relative;margin-left:5px;margin-right:10px;height:24px;line-height:24px">'+e.item+'</div><div margin-qty style="float:left;width:50px;border-left:1px solid black;padding:0px 5px;text-align:center;height:24px;line-height:24px">'+e.quantity+'</div><div style="float:left;border-left:1px solid black;padding:0px 5px;width:230px;text-align:center;height:24px;line-height:24px;">$'+p(r(n[t].original))+' > <span margin-price style="font-weight:600">'+e.price+"</span><span margin-percent> (+"+(100*e.margin-100).toFixed(1)+'%)</span></div><div margin-total style="float:left;border-left:1px solid black;width:75px;text-align:center;height:24px;line-height:24px">'+e.total+"</div></div>")}),$("[margin] [margin-content]").append('<div class="ac" style="padding:10px 10px 0px 10px;"><input cent style="width:60px;text-align:center" /> %</div><div style="width:100%;padding:10px;"><input range type="range" style="width:200px;margin:0 auto"></div><div class="wrapper" style="padding:10px"><button margin-apply class="wolfe-btn pull-right">APPLY</button><button margin-cancel class="wolfe-btn blue pull-right" style="margin-right:5px">CANCEL</button></div>'),$("[margin] [cent], [margin] [range]").val(0),$("[fade]").animate({opacity:.66},150,function(){$("[margin] [margin-content]").animate({opacity:1},100)}),$("[margin] [range], [margin] [cent]").on("input",function(){$("[margin] [cent]").val($(this).val()),$("[margin] [range]").val($(this).val());var t=(Number($("[cent]").val())+100)/100;$("[margin] [item-id]").each(function(){var a=$(this).attr("item-id");if($(this).find("input[type=checkbox]")[0].checked){var o=n[a].original,d=$(this).find("[margin-qty]").html().replace("$","").replace(",","");$(this).find("[margin-price]").html("$"+p(r(o*t))),$(this).find("[margin-percent]").html(" (+"+Number(100*t-100).toFixed(1)+"%)"),$(this).find("[margin-total]").html("$"+p(r(o*t*d))),e.map[i].items[a].margin=t}})}),$("input:checkbox").on("change",function(){var t=$(this).closest("[item-id]");t.hasClass("lowlight")?t.removeClass("lowlight"):t.addClass("lowlight")}),$("[margin] [margin-apply]").on("click",function(){t.find(a).each(function(){var t=e.p.get("this-item-id",$(this));$(this).html($('[margin] [item-id="'+t+'"] span').html())}),e.refresh(t),e.update(t),$("[margin] [margin-content]").fadeOut(100,function(){$("[fade]").fadeOut(150,function(){$("[margin]").off().unbind().remove()})})}),$("[margin] [margin-cancel]").on("click",function(){e.update(t),$("[margin] [margin-content]").fadeOut(100,function(){$("[fade]").fadeOut(150,function(){$("[margin]").off().unbind().remove(),e.refresh(t),e.update(t)})})}),$("[fade]").on("click",function(){e.update(t),$("[margin] [margin-content]").fadeOut(100,function(){$("[fade]").fadeOut(150,function(){$("[margin]").off().unbind().remove(),e.refresh(t),e.update(t)})})})},Form.prototype.marginOLD=function(t){var e=this,i=t.attr("data-formid"),n=[];e.dark(t);var a=t.find($(e.p.get("form-content",t))),o=$(this).closest($(".box")),r={html:{clone:a.clone(),position:a.offset(),width:a.outerWidth()},margin:{clone:o.clone(),position:o.offset(),width:o.outerWidth()}};$("#content").after("<div margin></div>"),$("[margin]").append('<div fade style="width:10000px;height:10000px;background-color:black;opacity:0.0;position:fixed;top:0;z-index:2;overflow:hidden;" disable></div>').append(r.html.clone.css({"z-index":999,position:"absolute",top:r.html.position.top,left:r.html.position.left,width:r.html.width,"margin-top":0,"background-color":"white","box-shadow":"0 0 20px rgba(0,0,0,.33)",opacity:0})),$("[fade]").animate({opacity:.5},150,function(){$("[margin] [form-content]").animate({opacity:1},100)}),$("[margin] [form-content]").append('<div class="ac" style="padding:10px 10px 0px 10px;"><input cent style="width:60px;text-align:center" /> %</div><div style="width:100%;padding:10px;"><input range type="range" style="width:200px;margin:0 auto"></div><div class="wrapper" style="padding:10px"><button margin-apply class="wolfe-btn pull-right">APPLY</button><button margin-cancel class="wolfe-btn blue pull-right" style="margin-right:5px">CANCEL</button></div>'),$("[margin] [cent], [margin] [range]").val(0);var p=e.p.get("remove"),d={},c=e.p.get("item-price"),l=function(t){return t.toFixed(2)},m=function(t){return t.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")};$("[margin] "+p).each(function(){var t=e.p.get("this-item-id",$(this));$(this).prev().removeAttr("contenteditable"),$(this).replaceWith('<input type="checkbox" class="twig-remove" style="width:15px;height:15px;margin-right:15px" data-item="'+t+'">')}),$("[margin] "+c).each(function(){var t=e.p.get("this-item-id",$(this)),n=e.map[i].items[t].margin;d[t]={current:$(this).html(),original:Number($(this).html().replace("$","").replace(",",""))/n}}),$("[margin] [range], [margin] [cent]").on("input",function(){$("[margin] [cent]").val($(this).val()),$("[margin] [range]").val($(this).val());var t=(Number($("[cent]").val())+100)/100;$("[margin] input[type=checkbox]").each(function(){$(this)[0].checked&&n.push($(this).attr("data-item"))}),$("[margin] "+c).each(function(){var a=e.p.get("this-item-id",$(this));if(n.includes(a)){var o=d[a].original;$(this).html("$"+m(l(o*t))),e.map[i].items[a].margin=t}})}),$("[margin] [margin-apply]").on("click",function(){t.find(c).each(function(){var t=e.p.get("this-item-id",$(this));$(this).html($('[margin] [data-item="'+t+'"] '+c).html())}),e.update(t),$("[margin] [form-content]").fadeOut(100,function(){$("[fade]").fadeOut(150,function(){$("[margin]").off().unbind().remove()})})}),$("[margin] [margin-cancel]").on("click",function(){e.update(t),$("[margin] [form-content]").fadeOut(100,function(){$("[fade]").fadeOut(150,function(){$("[margin]").off().unbind().remove(),e.update(t)})})}),$("[fade]").on("click",function(){e.update(t),$("[margin] [form-content]").fadeOut(100,function(){$("[fade]").fadeOut(150,function(){$("[margin]").off().unbind().remove(),e.update(t)})})})},Form.prototype["delete"]=function(t,e){void 0!=t.url&&void 0!=t.form_id&&$.post(t.url,{id:t.form_id}).done(function(t){"0"!=t?void 0!=e&&e(!0):(void 0!=e&&e(!1),console.log("Form delete failed with Slim 0"))}).fail(function(){void 0!=e&&e(!1),console.log("Internal Server Error")})},Form.prototype.post=function(t,e){var i=this;void 0!=t.url&&void 0!=t.template_id&&void 0!=t.client_id&&void 0!=t.job_id&&void 0!=t.job_number&&$.post(t.url,{template_id:t.template_id,client_id:t.client_id,job_id:t.job_id}).done(function(n){var n=JSON.parse(n),a=i.tab.objParent,o=Number($(a).find("["+i.tab.heir+"]").attr(i.tab.objhook)),r=n.id;$(a).find("["+i.tab.heir+"]").before("<div "+i.tab.objhook+'="'+o+'" class="'+i.tab.obj+' h">'+n.html+"</div>"),$(a).find("["+i.tab.heir+"]").replaceWith("<div "+i.tab.objhook+'="'+(o+1)+'" '+i.tab.heir+" hidden></div>"),$("["+i.tab.objhook+'="'+o+'"]').find("[form-blob]").attr("data-formid",r);var p=$('[data-formid="'+r+'"]');i.crawl(p),i.tab.append(t.template_name,function(a){i.populate(p,{job_number:t.job_number,date:n.date,client:n.client}),i.put({url:environment.root+"/put/form",id:r},function(){i.construct(p),e(p)})})}).fail(function(){void 0!=e&&e(!1),console.log("Internal Server Error")})},Form.prototype.put=function(t,e){var i=this,n=$('[data-formid="'+t.id+'"]'),a=n.clone();i.p["do"]("flush-items",a);var o=i.strip(a);void 0!=t.url&&void 0!=t.id?$.post(t.url,{id:t.id,html:o,json:JSON.stringify(i.map[t.id])}).done(function(){"0"!=t?void 0!=e&&e(!0):(void 0!=e&&e(!1),console.log("Form put failed with Slim 0"))}).fail(function(){void 0!=e&&e(!1),console.log("Internal Server Error")}):console.log("URL or data.id not supplied, form not saved.")};