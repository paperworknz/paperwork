"use strict";var Notification=function(t,o,i){function n(e){function a(i){f.remove(function(){for(var i in l){var a=l[i];d.css(i,a)}0===r&&(r++,s[r]&&n(s[r])),t.post(o.root+"/delete/notification",{id:e.id})})}var c,d=t(e.anchor),f=Paperwork.dark(),u=f.object,h=f.object.find(".dark_object"),l={};if(e.commands&&(c=JSON.parse(e.commands)))for(var g in c){var v=c[g];"tab"==g.toLowerCase()&&i.post("activateTab",v)}if(!d.length)return console.warn("Notification failed: No anchor"),void a();d.css("box-shadow")&&(l["box-shadow"]=d.css("box-shadow")),d.css("z-index")&&(l["z-index"]=d.css("z-index")),"static"==d.css("position")&&(l.position="static",d.css("position","relative")),"auto"!=d.css("background-color")&&"rgba(0, 0, 0, 0)"!=d.css("background-color")||(l["background-color"]="auto",d.css("background-color","white")),d.css("z-index","1000"),d.css("box-shadow","0 1px 2px rgba(0,0,0,.1)"),h.after('\n		<div class="pw-notification-container">\n			<div class="triangle-parent">\n				<div class="triangle-left">\n				</div>\n			</div>\n			<div class="pw-notification-text">\n				'+e.text+"\n			</div>\n		</div>\n	");var p=u.find(".pw-notification-container"),w=u.find(".triangle-parent"),b=u.find(".triangle-left"),x=u.find(".pw-notification-text");d.on("click",a),p.on("click",a),w.css("height",x.outerHeight()),b.css("top",w.outerHeight()/2-b.outerHeight()/2),p.css({height:x.outerHeight()+1,width:w.outerWidth()+x.outerWidth()+1}),p.css({top:d.offset().top+d.outerHeight()/2-p.outerHeight()/2,left:d.offset().left+d.outerWidth()+5});var k=p.outerWidth()+p.offset().left,m=t(window).outerWidth();k>m&&x.css("width",p.outerWidth()-(k-m)-21),f.run()}function e(){t.post(o.root+"/get/notification",{page:o.page}).done(function(t){t&&(t=JSON.parse(t))&&(s=t,t.length>1&&(r=0),n(t[0]))})}var r,s=[];return{run:e,render:n}}(jQuery,environment,Events);