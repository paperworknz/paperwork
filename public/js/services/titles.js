"use strict";Core.addService("titles",function(){function t(t){var e,o=t.data("title");i.find("#title").length||i.append('<div id="title"><div class="title_text"></div><div class="title_triangle"></div></div>'),e=i.find("#title"),e.find(".title_text").html(o),e.css({top:t.offset().top-e.outerHeight(),left:t.offset().left+t.outerWidth()/2-e.outerWidth()/3}),e.show()}function e(){i.find("#title").hide()}var i=Paperwork.body;i.on("touchstart mouseenter","[data-title]",function(){t($(this))}),i.on("touchmove mouseleave click","[data-title]",e),i.on("mousedown click",e)});