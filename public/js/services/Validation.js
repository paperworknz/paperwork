"use strict";var Validation=function(){this.data={}};Validation.prototype.input=function(t,a,s,i){var n=this,o="input[type=text], input[type=email], input[type=password]",e={allowDuplicates:!1};void 0!=i&&(e=$.extend(e,i)),n.data[s]={};var u=function(a){var i=[],u=[];void 0==a&&(a=!1),l(),t.find(o).each(function(){var t=$(this).val().trim();""!=t?-1===u.indexOf(t)||e.allowDuplicates?(u.push(t),i.push({val:t,attr:this.attributes,status:!0}),$(this).removeClass("not-ok")):(i.push({val:t,attr:this.attributes,status:"duplicate"}),a&&$(this).addClass("not-ok"),r()):this.hasAttribute("required")?(i.push({val:t,attr:this.attributes,status:"empty"}),a&&$(this).addClass("not-ok"),r()):(i.push({val:t,attr:this.attributes,status:!0}),$(this).removeClass("not-ok"))}),n.data[s]=i},r=function(){a.attr("disabled",""),a.addClass("spotlight")},l=function(){a.removeAttr("disabled"),a.removeClass("spotlight")};t.on("keyup",o,function(){u(!1)}),t.on("blur",o,function(){u(!1)}),a.parent().on("click",function(){$(this).find("button").attr("disabled")&&u(!0)}),u(!1)};