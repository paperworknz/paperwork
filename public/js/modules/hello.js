"use strict";Core.addModule("hello",function(t){function e(){n.on("click",'[data-type="next-step"]',function(t){a++,n.find('[data-type="parent"]').animate({opacity:0},100,i)})}function i(){var t=void 0;a>1||(n.css("height",""),o=n.outerHeight(),n.find('[data-type="one"]').hide(),n.find('[data-type="two"]').show(),t=n.outerHeight(),n.css("height",o),n.animate({height:t},200,"swing",function(){n.find('[data-type="parent"]').animate({opacity:1},100)}))}var n=t.element,a=0,o=0;e()});