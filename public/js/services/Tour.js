"use strict";var Tour=function(e,t,o){function r(o){function i(){d.remove(function(){for(var n in h){var i=h[n];a.css(n,i)}e.post(t.root+"/delete/tour",{id:o.id}).done(function(){if(l.href)e("body").css("pointer-events","none"),Paperwork["goto"](l.href);else if(0===s){if(void 0!=l.chain&&!l.chain)return;s++,c[s]&&r(c[s])}})})}var a=e(o.anchor),d=Paperwork.dark(),u=d.object,f=d.object.find(".dark_object"),h={},l={};if(o.commands&&(l=n(o.commands)),!a.length)return console.warn("Item failed: No anchor"),void i();a.css("box-shadow")&&(h["box-shadow"]=a.css("box-shadow")),a.css("z-index")&&(h["z-index"]=a.css("z-index")),"static"==a.css("position")&&(h.position="static",a.css("position","relative")),"auto"!=a.css("background-color")&&"rgba(0, 0, 0, 0)"!=a.css("background-color")||(h["background-color"]="",a.css("background-color","white")),a.css("z-index","1000"),a.css("box-shadow","0 1px 2px rgba(0,0,0,.1)"),f.after('\n		<div class="pw-item-container">\n			<div class="triangle-parent">\n				<div class="triangle-left">\n				</div>\n			</div>\n			<div class="pw-item-text">\n				'+o.text+"\n			</div>\n		</div>\n	");var p=u.find(".pw-item-container"),v=u.find(".triangle-parent"),g=u.find(".triangle-left"),w=u.find(".pw-item-text");l["return"]?"anchor"==l["return"]?(a.on("click",i),p.find(".pw-item-text").css("cursor","default")):"item"==l["return"]?p.on("click",i):(a.on("click",i),p.on("click",i)):(a.on("click",i),p.on("click",i)),v.css("height",w.outerHeight()),g.css("top",v.outerHeight()/2-g.outerHeight()/2),p.css({height:w.outerHeight()+1,width:v.outerWidth()+w.outerWidth()+1}),p.css({top:a.offset().top+a.outerHeight()/2-p.outerHeight()/2,left:a.offset().left+a.outerWidth()+5});var b=p.outerWidth()+p.offset().left,k=e(window).outerWidth();b>k&&w.css("width",p.outerWidth()-(b-k)-21),d.run()}function n(e){var t={};e=JSON.parse(e);for(var r in e){var n=e[r];switch(-1!==r.indexOf("e.")&&o.post(r.replace("e.",""),n),r){case"href":n.trim()&&(t.href=n);break;case"chain":n!==!0&&"true"!==n&&"1"!=n&&(t.chain=!1);break;case"return":"anchor"==n.toLowerCase()&&(t["return"]="anchor"),"item"==n.toLowerCase()&&(t["return"]="item")}}return t}function i(){e.post(t.root+"/get/tour",{page:t.page}).done(function(e){e&&(e=JSON.parse(e),c=e,e.length>1&&(s=0),r(e[0]))})}var s,c=[];return{run:i,render:r}}(jQuery,environment,Events);