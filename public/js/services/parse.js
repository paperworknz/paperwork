"use strict";Core.addService("parse",function(){function t(t){var e=t.clone();return e.contents().filter(function(){return 3===this.nodeType}).wrap("<div>"),e.contents().filter(function(){return 0===$.trim(this.innerHTML).length}).remove(),e.find("*").each(function(){var t=$(this).contents();return $(this).is("br")?!0:void($(this).is("div")||$(this).replaceWith(t))}),1===e.children().length?e.children():e}function e(t){var e=arguments.length<=1||void 0===arguments[1]?{}:arguments[1],r=e.decimal,n=void 0===r?0:r,i=e.natural,o=void 0===i?!1:i;return t=t.toString(),t=t.replace(/[^\d.-]/g,""),""===t?t:isNaN(Number(t))?t:(t=Number(t),n&&(t=Number(t.toFixed(n))),o&&(t=t.toFixed(n),t=t.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")),t)}function r(t){return t=e(t,{decimal:2,natural:!0}),t&&(t="$"+t),t}return{toText:t,toNumber:e,toDollar:r}});