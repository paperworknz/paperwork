"use strict";var Core=function(n,e){function r(e,r){return f[e]?(console.warn("Module name '"+e+"' already assigned"),!1):f[e]={status:!1,run:r,stop:function(){n('[data-module="'+e+'"]').off().unbind()}}}function t(n,e){return v[n]?(console.warn("Behavior name '"+n+"' already assigned"),!1):v[n]=e}function o(n,e){return m[n]?(console.warn("Service name '"+n+"' already assigned"),!1):m[n]=e}function a(e,r){var t,o,a,i={},c=r?environment.root+"/get/module/"+e+"/"+r:environment.root+"/get/module/"+e;n.get(c).done(function(r){function c(){if(r.third){var e=function(e){var t=r.third[e];i[t]=!1,n.getScript(environment.root+"/js/3rd/"+t+".js",function(){i[t]=!0})};for(var t in r.third)e(t);a=setInterval(function(){m(d)},25)}}function d(){if(r.classes){var e=function(e){var t=r.classes[e];i[t]=!1,n.getScript(environment.root+"/js/classes/"+t,function(){i[t]=!0})};for(var t in r.classes)e(t);a=setInterval(function(){m(v)},25)}}function v(){return r.css&&n('<link type="text/css" rel="stylesheet">').appendTo("head").attr("href",environment.root+"/css/modules/"+r.css),r.js?void n.getScript(environment.root+"/js/modules/"+r.js,p):console.warn("Module js does not exist in cache")}function m(n){for(var e in i){var r=i[e];if(r===!1)return}clearInterval(a),n()}function p(){return s(e),o.animate({opacity:1},100),s(e)}return r=JSON.parse(r),"error"==r.type?console.warn(r.message):(t=l("dark"))?(t.run(),o=n('\n				<part class="dark_content" style="opacity: 0;">\n					<module data-module="'+e+'">\n						'+r.module+"\n					</module>\n				</part>\n			").appendTo(t.object),f[e]?(u(e),p()):void c()):console.warn("Service 'dark' undefined")})}function i(e,r){return v[e]?(console.log("cached tab"),r?r():!0):void n.getScript(environment.root+"/js/behaviors/"+e+".js").done(r)}function s(n){if(!f[n])return e;if(f[n].status)return!0;var r=f[n].run(c(n))||{};return r.onload&&r.onload(),r.start&&r.start(),f[n].status=!0}function u(n){return f[n]?(f[n].status=!1,f[n].stop(),!0):e}function c(n){var e=Paperwork.body.find('[data-module="'+n+'"]'),r={name:n,element:e,require:l,stop:function(){return u(n)}};return r.use=function(e,r){d(n,e,r)},r}function d(n,e,r){var t=c(n);return r||(r={}),delete t.use,v[e]?v[e](t,r):void i(e,function(){return new v[e](t,r)})}function l(n){return m[n]?m[n]():void console.warn("Service "+n+" is undefined")}var f={},v={},m={};return{require:l,loadModule:a,addModule:r,addBehavior:t,addService:o,start:s,stop:u,startAll:function(){for(var n in f)s(n)},stopAll:function(){for(var n in f)u(n)}}}(jQuery);