"use strict";function _defineProperty(t,a,n){return a in t?Object.defineProperty(t,a,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[a]=n,t}Core.addModule("document-margin",function(t){function a(){r.on("click",".inventory-item",function(){var t=$(this).index();l[t]?l[t]=!1:l[t]=!0,$(this).toggleClass("selected")}),r.on("input",'[data-type="slider"], [data-type="margin-input"]',function(){var t=$(this).val();r.find('[data-type="margin-input"], [data-type="slider"]').val(t),t=i.toNumber(t),t=i.toNumber((t+100)/100,{decimal:2}),e(t),n()}),r.on("click",'[data-type="apply-button"]',function(){Paperwork.send("document.build",_defineProperty({},t.data.document_id,t.data.documents)),t.stop()}),r.on("click",'[data-type="cancel-button"]',function(){t.stop()})}function n(){var t=0,a=0,n=0;r.find('[data-type="margin-content"]').html("");for(var e in o){var d=o[e],p=i.toNumber(d.quantity,{decimal:2}),m=i.toNumber(d.price,{decimal:2}),c=i.toNumber(d.margin,{decimal:2}),u=void 0;m&&(m*=c),u=p*m,u=i.toNumber(u,{decimal:2}),u&&(t+=Number(u)),p=i.toNumber(p,{decimal:2,natural:!0}),c=100*c-100,c=i.toNumber(c,{decimal:0,natural:!0}),m=i.toDollar(m),u=i.toDollar(u),0===p&&(p="0.00"),"$0"===m&&(m="$0.00"),"$0"===u&&(u="$0.00"),p&&m||(u="");var s=l[e]?"selected":"";r.find('[data-type="margin-content"]').append('\n				<section class="inventory-item '+s+'">\n					<part class="inventory-item_name">\n						<part data-type="name">\n							'+d.name+'\n						</part>\n						\n					</part>\n					<part class="inventory-item_qty">\n						<part data-type="quantity">\n							'+p+'\n						</part>\n					</part>\n					<part class="inventory-item_price">\n						<part data-type="price">\n							'+m+'\n						</part>\n					</part>\n					<part class="inventory-item_total">\n						<part data-type="item-total">\n							'+u+"\n						</part\n					</part>\n				</section>\n			"),c>0&&r.find('[data-type="margin-content"] [data-type="name"]').after('\n					<part class="inventory-item_margin">\n						Margin: '+c+"%\n					</part>\n				")}t=i.toNumber(t,{decimal:2}),a=i.toDollar(t/100*15),n=i.toDollar(t/100*15+t),r.find('[data-type="subtotal"]').html(i.toDollar(t)),r.find('[data-type="tax"]').html(i.toDollar(a)),r.find('[data-type="total"]').html(i.toDollar(n))}function e(t){for(var a in o){var n=o[a];l[a]&&(n.margin=t)}}var r=t.element,i=t.require("parse"),o=t.data.documents.items||{},l={};a(),n();for(var d in o)l[d]=!1});