"use strict";Core.addModule("jobs",function(e){function n(){$.get(r.get).done(function(e){c=JSON.parse(e);for(var n in c)i.push(c[n].name);t()})}function t(){o.off(),o.on("click",".create-new",function(){o.find("#new-content").slideToggle(100)}),o.find(".typeahead").typeahead({hint:!0,highlight:!0,minLength:1},{source:substringMatcher(i)})}var o=e.element,i=[],c=[],r={get:environment.root+"/get/clients",post:environment.root+"/post/client"};n()});