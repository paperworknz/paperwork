"use strict";var Tour=function(t,e,n){function o(t){var e={};t=JSON.parse(t);for(var o in t){var i=t[o];switch(-1!==o.indexOf("e.")&&n.post(o.replace("e.",""),i),o){case"href":i.trim()&&(e.href=i);break;case"chain":i!==!0&&"true"!==i&&"1"!=i&&(e.chain=!1);break;case"return":"anchor"==i.toLowerCase()&&(e["return"]="anchor"),"item"==i.toLowerCase()&&(e["return"]="item")}}return e}function i(e,n,o){var i,s,a,c,d,f,u,p,l,m=0,h=o.object,v=o.object.find(".dark_object");e.position&&(l=e.position.split("-")[0]);var w=function g(l){function w(i,s,a,c,d){var f=t(window).width(),u=t(window).height();if(4!==d){if(0>i)return m++,g("right");if(s+a>f)return m++,g("bottom");if(i+c>u)return m++,g("left");if(0>s)return m++,g("top")}else console.warn("Tour skipped: Screen size too small."),r(e,n,o,!1)}switch(h.find(".pw-item-container").remove(),v.after('\n			<div class="pw-item-container wrap">\n			</div>\n		'),l){case"left":case"right":h.find(".pw-item-container").append('\n					<div class="pw-item-text '+l+'">\n						'+e.text+'\n					</div>\n					<div class="triangle-parent '+l+'">\n						<div class="triangle '+l+'">\n						</div>\n					</div>\n				');break;case"top":h.find(".pw-item-container").append('\n					<div class="pw-item-text">\n						'+e.text+'\n					</div>\n					<div class="triangle-parent '+l+'">\n						<div class="triangle '+l+'">\n						</div>\n					</div>\n				');break;case"bottom":h.find(".pw-item-container").append('\n					<div class="triangle-parent '+l+'">\n						<div class="triangle '+l+'">\n						</div>\n					</div>\n					<div class="pw-item-text">\n						'+e.text+"\n					</div>\n				")}switch(i=h.find(".pw-item-container"),s=h.find(".triangle"),a=h.find(".pw-item-text"),p=5,l){case"left":case"right":s.parent().css("height",a.outerHeight()),s.css("top",s.parent().outerHeight()/2-s.outerHeight()/2);break;case"top":case"bottom":s.parent().css("width",a.outerWidth())}switch(c=n.offset().top,d=n.offset().left,f=i.outerWidth(),u=i.outerHeight(),l){case"top":i.css({top:c-u-p,left:d+(n.outerWidth()/2-f/2)}),w(i.offset().top,i.offset().left,f,u,m);break;case"right":i.css({top:c+n.outerHeight()/2-u/2,left:d+n.outerWidth()+5}),w(i.offset().top,i.offset().left,f,u,m);break;case"bottom":i.css({top:c+n.outerHeight()+p,left:d+(n.outerWidth()/2-f/2)}),w(i.offset().top,i.offset().left,f,u,m);break;case"left":i.css({top:c+n.outerHeight()/2-u/2,left:d-f-5}),w(i.offset().top,i.offset().left,f,u,m)}};return w(l),i}function s(e){var n,s=t(e.anchor),a=Paperwork.dark();return e.adjustments={},e.commands&&(e.commands=o(e.commands)),s.length?(s.css("box-shadow")&&(e.adjustments["box-shadow"]=s.css("box-shadow")),s.css("z-index")&&(e.adjustments["z-index"]=s.css("z-index")),"static"==s.css("position")&&(e.adjustments.position="static",s.css("position","relative")),"auto"!=s.css("background-color")&&"rgba(0, 0, 0, 0)"!=s.css("background-color")||(e.adjustments["background-color"]="",s.css("background-color","white")),s.css("z-index","1000"),s.css("box-shadow","0 1px 2px rgba(0,0,0,.1)"),n=i(e,s,a),e.commands["return"]?"anchor"==e.commands["return"]?(n.find(".pw-item-text").css("cursor","default"),s.on("click",function(){r(e,s,a)})):"item"==e.commands["return"]&&n.on("click",function(){r(e,s,a)}):(s.on("click",function(){r(e,s,a)}),n.on("click",function(){r(e,s,a)})),void a.run()):(console.warn("Tour skipped: Anchor unavailable."),void r(e,s,a,!1))}function r(n,o,i,r){i.remove(function(){for(var i in n.adjustments){var a=n.adjustments[i];o.css(i,a)}void 0==r&&(r=!0),r&&t.post(e.root+"/delete/tour",{id:n.id}).done(function(){if(n.commands.href)t("body").css("pointer-events","none"),Paperwork["goto"](n.commands.href);else if(0===c){if(void 0!=n.commands.chain&&!n.commands.chain)return;c++,d[c]&&s(d[c])}})})}function a(){t.post(e.root+"/get/tour",{page:e.page}).done(function(t){t&&(d=JSON.parse(t),d.length>1&&(c=0),s(d[0]))})}var c,d=[];return{run:a,render:s}}(jQuery,environment,Events);