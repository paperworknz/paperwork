"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol?"symbol":typeof t};Core.addBehavior("document",function(t,e){function n(){Paperwork.on("document.build",function(t){if("object"!==("undefined"==typeof t?"undefined":_typeof(t))||null===t)return console.warn("New document request not an object");for(var e in t)g[e]=t[e],o(e),s(e)}),Paperwork.on("document."+t.name+".reload",function(t){"object"===("undefined"==typeof t?"undefined":_typeof(t))&&null!==t&&(b=t),v.find('[data-type="document"]').each(function(){var t=$(this).data("id");o(t)})}),Paperwork.on("document."+t.name+".save",function(t){return N.toNumber(t)?void s(t,function(){Paperwork.send("notification")}):console.warn("Document ID not supplied")})}function a(){f="undefined"==typeof job?0:job.job_id,$.get(environment.root+"/get/inventory",function(t){$.get(environment.root+"/get/document/"+f,function(e){$.get(environment.root+"/get/template-properties",function(n){g=JSON.parse(e),b=JSON.parse(n),w.origin=JSON.parse(t);for(var a in w.origin)w.flat.push(w.origin[a].name);v.find('[data-type="document"]').each(function(){var t=$(this).data("id");o(t)})})})})}function o(t){var e=v.find('[data-type="document"][data-id="'+t+'"]'),n=e.find("[data-template]").data("template");$('[data-css="'+n+'"]').length<1&&$('<link data-css="'+n+'" type="text/css" rel="stylesheet">').appendTo("head").attr("href",environment.root+"/css/templates/"+n+".css"),f&&null==g[t].items&&(g[t].items=[]),r(t),f&&i(t),f&&d(t),f&&c(t),m(t),e.css("pointer-events","auto").animate({opacity:1},250)}function i(t){var e='[data-type="document"][data-id="'+t+'"]';v.find(e+' [data-type="inventory-input"]').html('\n			<input type="text" class="typeahead" placeholder="Item">\n		').find(".typeahead").typeahead({hint:!0,highlight:!0,minLength:1},{source:substringMatcher(w.flat)}),v.off("typeahead:select",e+" .tt-input"),v.on("typeahead:select",e+" .tt-input",function(){13!=event.which&&(u({document_id:t,name:$(this).val()}),m(t),$(this).typeahead("val",""))}),v.off("keydown",e+" .tt-input"),v.on("keydown",e+" .tt-input",function(){13==event.which&&(u({document_id:t,name:$(this).val()}),m(t),$(this).typeahead("val",""),13==event.which&&event.preventDefault())})}function r(t){var e='[data-type="document"][data-id="'+t+'"]';for(var n in b){var a=b[n],o=v.find(e+' [data-property="'+n+'"]');"background_colour"==n&&o.css("background-color",a||"white"),"text_colour"==n&&o.css("color",a||"white"),-1==n.indexOf("colour")&&o.html(a)}}function d(t){var e='[data-type="document"][data-id="'+t+'"]';v.off("keyup",e+" [data-aspect]"),v.on("keyup",e+" [data-aspect]",function(){var e=$(this).data("aspect"),n=$(this).html().trim();g[t][e]=n,s(t)})}function c(t){var e='[data-type="document"][data-id="'+t+'"]',n=e+' [data-type="inventory-content"]';v.on("keydown",n+' [data-type="quantity"], '+n+' [data-type="price"]',function(){return 13==event.which?(event.preventDefault(),event.stopPropagation(),$(this).blur()):void 0}),v.off("blur",n+' [data-type="name"], '+n+' [data-type="quantity"], '+n+' [data-type="price"]'),v.on("blur",n+' [data-type="name"], '+n+' [data-type="quantity"], '+n+' [data-type="price"]',function(){var e,n,a=$(this).data("type"),o=$(this).closest(".inventory-item").index();e="name"==a?$(this).html().trim():$(this).text().trim(),n=g[t].items[o][a],n!=e&&(g[t].items[o][a]=e,s(t),m(t),setTimeout(function(){x.end("[contenteditable]:hover")},0))}),v.off("click",n+' [data-type="remove"]'),v.on("click",n+' [data-type="remove"]',function(){var e=$(this).closest(".inventory-item").index();g[t].items.splice(e,1),s(t),m(t)})}function u(t){var e=t.document_id,n=t.name,a=void 0===n?"":n,o=t.quantity,r=void 0===o?"":o,d=t.price,c=void 0===d?"":d,u=t.margin,p=void 0===u?1:u,l=!1;for(var f in w.origin){var y=w.origin[f];if(y.name==[a]){c=y.price,l=!0;break}}"0.00"==c&&(c=""),g[e].items.push({name:a,quantity:r,price:c,margin:p}),s(e),!l&&a.length&&swal({html:!0,title:"Add "+a+" to your inventory?",text:"If you save this item you can use it again in future.",showCancelButton:!0,closeOnConfirm:!0,cancelButtonText:"No",confirmButtonText:"Yes"},function(t){t&&$.post(h.postInventory,{name:a,price:"0.00"}).done(function(t){t=JSON.parse(t),w.origin.push({name:a,price:"0.00"}),w.flat.push(a),i()})}),m(e)}function p(t){var e=(v.find('[data-type="document"][data-id="'+t+'"]'),0);for(var n in g[t].items){var a=g[t].items[n];a.hasOwnProperty("margin")||(a.margin=1);var o=N.toNumber(a.quantity,{decimal:2}),i=N.toNumber(a.price,{decimal:2}),r=N.toNumber(a.margin,{decimal:2}),d=void 0;d=o*(i*r),d=N.toNumber(d,{decimal:2}),d&&(e+=Number(d)),a.quantity=o,a.price=i,a.total=d,a.margin=r}g[t].subtotal=N.toNumber(e,{decimal:2}),g[t].tax=N.toNumber(g[t].subtotal/100*15,{decimal:2}),g[t].total=N.toNumber(g[t].subtotal+g[t].tax,{decimal:2})}function m(t){var e=g[t],n=v.find('[data-type="document"]').filter('[data-id="'+t+'"]');f&&p(t);for(var a in e){var o=["subtotal","tax","total"],i=e[a];-1!=o.indexOf(a)&&(i=N.toDollar(i)),n.find('[data-aspect="'+a+'"]').html(i)}if(f){n.find('[data-type="inventory-content"]').html("");for(var r in e.items){var d=e.items[r],c=d.margin,u=d.quantity,m=d.price,s=d.total;m&&(m*=c),u=N.toNumber(u,{decimal:2,natural:!0}),m=N.toDollar(m),s=N.toDollar(s),0===u&&(u="0.00"),"$0"===m&&(m="$0.00"),"$0"===s&&(s="$0.00"),u&&m||(s=""),n.find('[data-type="inventory-content"]').append('\n				<doc-section class="inventory-item wrap">\n					<doc-part class="inventory-item_name">\n						<doc-text data-type="name">\n							'+d.name+'\n						</doc-text>\n						<doc-part data-type="remove" class="remove-btn"></doc-part>\n					</doc-part>\n					<doc-part data-type="quantity" class="inventory-item_qty">\n						'+u+'\n					</doc-part>\n					<doc-part data-type="price" class="inventory-item_price">\n						'+m+'\n					</doc-part>\n					<doc-part data-type="item-total" class="inventory-item_total">\n						'+s+"\n					</doc-part>\n				</doc-section>\n			")}n.find('[data-aspect="name"], [data-aspect="date"], [data-aspect="description"]').attr("contenteditable","true"),n.find('[data-type="inventory-content"] .inventory-item').find('[data-type="name"], [data-type="quantity"], [data-type="price"]').attr("contenteditable","true")}}function s(t,e){clearTimeout(y),y=setTimeout(function(){$.post(h.put,{id:t,document:g[t]}).done(function(t){e instanceof Function&&e()})},500)}function l(e){return e?N.toNumber(e)?g[e]:void console.warn("NaN provided while getting documents under context: "+t.name):g}var f,y,v=t.element,h={put:environment.root+"/put/document",postInventory:environment.root+"/post/inventory"},b=[],g=[],w={origin:{},flat:[]},N=t.require("parse"),x=t.require("caret");return n(),a(),{documents:l,properties:function(){return b}}});