"use strict";Core.addService("dark",function(){function n(n){void 0==n&&(n=Paperwork.body),t=$('\n			<div class="'+d+'" data-module="'+i+'">\n				<div class="dark_object" disable>\n				</div>\n			</div>\n		').appendTo(n),t.css("z-index",c),$("."+d).on("click",e),$("."+d).on("click","module",function(n){n.stopPropagation()})}function o(n){t.find(".dark_object").animate({opacity:.5},150,function(){void 0!=n&&n()})}function e(n){function o(){t.find(".dark_object").fadeOut(150,function(){return t.remove(),"function"==typeof n?n():void 0})}t.find("*:not(.dark_object)").length?t.find("*:not(.dark_object)").fadeOut(150,o):o()}var t,d="dark_container",i=Paperwork.random(6),c=49;return n(),$(window).on("keyup",function(n){return 27===n.keyCode&&e(),!1}),{object:t,run:o,remove:e}});