"use strict";var Typeahead=function(t,i,a){this.src=t,void 0!=i?this.params=i:this.params={hint:!0,highlight:!0,minLength:1},void 0!=a?this.env=a:this.env={source:substringMatcher(this.src)}};Typeahead.prototype.run=function(t){var i=this;$(t).find(".typeahead").typeahead(i.params,i.env)};