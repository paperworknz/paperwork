"use strict";function _defineProperty(t,a,n){return a in t?Object.defineProperty(t,a,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[a]=n,t}Core.addModule("document-margin",function(t){function a(){r.on("click",".inventory-item",function(){var t=$(this).index();l[t]?l[t]=!1:l[t]=!0,$(this).toggleClass("selected")}),r.on("input",'[data-type="slider"], [data-type="margin-input"]',function(){var t=$(this).val();r.find('[data-type="margin-input"], [data-type="slider"]').val(t),t=i.toNumber(t),t=i.toNumber((t+100)/100,{decimal:2}),e(t),n()}),r.on("click",'[data-type="apply-button"]',function(){Paperwork.send("document.build",_defineProperty({},t.data.document_id,t.data.documents)),t.stop()}),r.on("click",'[data-type="cancel-button"]',t.stop)}function n(){var t=0,a=0,n=0;r.find('[data-type="margin-content"]').html("");for(var e in o){var d=o[e],m=i.toNumber(d.quantity,{decimal:2}),c=i.toNumber(d.price,{decimal:2}),p=i.toNumber(d.margin,{decimal:2}),u=void 0;c&&(c*=p),u=m*c,u=i.toNumber(u,{decimal:2}),u&&(t+=Number(u)),m=i.toNumber(m,{decimal:2,natural:!0}),p=100*p-100,p=i.toNumber(p,{decimal:0,natural:!0}),c=i.toDollar(c),u=i.toDollar(u),0===m&&(m="0.00"),"$0"===c&&(c="$0.00"),"$0"===u&&(u="$0.00"),m&&c||(u="");var s=l[e]?"selected":"";r.find('[data-type="margin-content"]').append('\n				<section class="inventory-item '+s+'">\n					<part class="inventory-item_name">\n						<part data-type="name">\n							'+d.name+'\n						</part>\n					</part>\n					<part data-type="quantity" class="inventory-item_qty">\n						'+m+'\n					</part>\n					<part data-type="price" class="inventory-item_price">\n						'+c+'\n					</part>\n					<part data-type="item-total" class="inventory-item_total">\n						'+u+"\n					</part>\n				</section>\n			"),p>0&&r.find('[data-type="margin-content"] [data-type="name"]').after('\n					<part class="inventory-item_margin">\n						Margin: '+p+"%\n					</part>\n				")}t=i.toNumber(t,{decimal:2}),a=i.toDollar(t/100*15),n=i.toDollar(t/100*15+t),r.find('[data-type="subtotal"]').html(i.toDollar(t)),r.find('[data-type="tax"]').html(i.toDollar(a)),r.find('[data-type="total"]').html(i.toDollar(n))}function e(t){for(var a in o){var n=o[a];l[a]&&(n.margin=t)}}var r=t.element,i=t.require("parse"),o=t.data.documents.items||{},l={};a(),n();for(var d in o)l[d]=!1});