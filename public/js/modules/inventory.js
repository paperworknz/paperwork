"use strict";Core.addModule("inventory",function(e){function n(){var e=p.find(".filter").val().toLowerCase();for(var n in l){var i=l[n],a=i.name.toLowerCase();i.display=-1!==a.indexOf(e)}r()}function i(){p.find("[data-id]").each(function(){var e=$(this).data("id"),n=$(this).find('input[name="name"]').val(),i=$(this).find('input[name="price"]').val();l[e]={display:!0,name:n,price:i}})}function a(){var e=p.find('.inventory-add input[name="name"]'),n=p.find('.inventory-add input[name="price"]');$.post(c.post,{name:e.val(),price:n.val()}).done(function(i){i=JSON.parse(i),Paperwork.ready(p.find(".inventory-add .button"),"ADD"),e.val(""),n.val(""),e.focus(),Paperwork.send("inventory.add",{id:i.id,name:i.name,price:i.price}),Paperwork.send("notification","Saved")})}function t(e){return e.id?(e.price||(e.price=0),l[e.id]={display:!0,name:e.name,price:e.price},void r()):void console.warn("ID not suppied")}function r(){v.html("");for(var e in l){var n=l[e];n.display&&(n.price=Paperwork.dollar(n.price,{sign:!1}),v.prepend('\n				<li data-id="'+e+'">\n					<div class="item">\n						<input type="text" name="name" value="'+n.name+'" placeholder="'+n.name+'">\n						<input type="text" name="price" value="'+n.price+'" placeholder="'+n.price+'">\n						<div data-type="remove" class="remove-btn"></div>\n					</div>\n				</li>\n			'))}}function o(){p.on("change","ul input",function(){var e=$(this).closest("[data-id]"),n=e[0].attributes["data-id"].value,i=e.find('input[name="name"]').val(),a=e.find('input[name="price"]').val();i.length&&a.length&&n.length&&(l[n].name=i,l[n].price=a,$.post(c.put,{id:n,name:i,price:a}).done(function(e){e=JSON.parse(e),l[e.id].name=e.name,l[e.id].price=e.price,r(),Paperwork.send("notification","Saved")}))})}function d(){var e=$(this).closest("[data-id]"),n=e[0].attributes["data-id"].value;$.post(c["delete"],{id:e[0].attributes["data-id"].value}).done(function(i){delete l[n],e.remove(),Paperwork.send("notification","Saved")})}var p=e.element,v=p.find(".inventory-list"),c={put:environment.root+"/put/inventory",post:environment.root+"/post/inventory","delete":environment.root+"/delete/inventory"},l={};i(),o(),r(),p.on("click",".inventory-add .button",a),p.on("click",'[data-type="remove"]',d),Paperwork.on("inventory.add",t),Paperwork.validate(p.find(".inventory-add"),p.find(".inventory-add .button"),Paperwork.random(6),{allowDuplicates:!0}),p.on("keyup",".filter",n)});