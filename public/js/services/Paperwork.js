"use strict";function since(t){var n=new Date,i=t.split(/[- :]/),t=new Date(i[0],i[1]-1,i[2],i[3],i[4],i[5]),a=(n.getTime()-t.getTime())/1e3;if(60>a)return parseInt(a)+"s ago";if(3600>a)return parseInt(a/60)+"m ago";if(86400>=a)return parseInt(a/3600)+"h ago";if(a>86400){var e=t.getDate(),o=t.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ",""),r=t.getFullYear()==n.getFullYear()?"":" "+t.getFullYear();return e+" "+o+r}}function goto(t){$("#content").animate({opacity:0},"fast"),window.location=t}var Paperwork=function(){function t(t){t.addClass("button-wait"),t.html('\n			<div class="wait la-ball-fall">\n				<div></div>\n				<div></div>\n				<div></div>\n			</div>\n		')}function n(t,n,i){t.removeClass("button-wait"),t.html(n),void 0!=i&&i()}function i(t){$("#content").animate({opacity:0},"fast"),window.location=t}function a(t,n){for(var i,a,e="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",r="",c=6;c>0;--c)r+=e[Math.floor(Math.random()*e.length)];i=$(".pw-notification"),i.length<1&&(o.append('\n			<div class="pw-notification">\n			</div>\n		'),i=$(".pw-notification")),void 0==t&&(t="Saved"),void 0==n&&(n=1e3),i.append('\n		<notification class="'+r+'" style="margin-bottom: -15px">\n			'+t+"\n		</notification>\n	"),a=$("."+r),a.animate({opacity:.75,marginBottom:"5px"},100,function(){setTimeout(function(){a.animate({opacity:0},1e3,function(){a.remove()})},n)})}function e(t){var t=void 0!=t?con:$("#content"),n="dark_container",i="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",a="";r++;for(var e=6;e>0;--e)a+=i[Math.floor(Math.random()*i.length)];t.after('\n		<div class="'+n+'" data-module="'+a+'">\n			<div class="dark_object" disable>\n			</div>\n		</div>\n	');var o=$("."+n).filter('[data-module="'+a+'"]');return o.css("z-index",r),{object:o,run:function(t){o.find(".dark_object").animate({opacity:.66},150,function(){void 0!=t&&t()})},remove:function(t){o.find(".dark_object").fadeOut(150,function(){o.remove(),void 0!=t&&t()})}}}var o=$("body"),r=49;(function(){var t="input, select, textarea, [contenteditable]";o.on("keydown",function(n){var i=n.keyCode||n.which,a=$(n.target);8!==i||a.is(t)||n.preventDefault()})})(),function(){var t="input[type=text], input[type=email], input[type=password]";o.on("keydown",t,function(t){var n=t.keyCode||t.which,i=$(":input:eq("+($(":input").index(this)+1)+")");13===n&&(i.focus(),i.is("button")||t.preventDefault())})}();return{wait:t,ready:n,saved:a,"goto":i,dark:e}}();$("a").on("click",function(t){$(this).attr("href")&&(t.preventDefault(),goto($(this).attr("href")))});