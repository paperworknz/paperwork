"use strict";Core.addService("annyang",function(){function n(){return localStorage.annyang?void("false"!=localStorage.annyang&&(annyang.addCommands({"go to job :job":o,"open *command":e}),annyang.start())):localStorage.annyang="false"}function o(n){Number(n)&&Paperwork["goto"](environment.root+"/job/"+n)}function e(n){var o="";n=n.toLowerCase(),-1!==n.indexOf("home")&&(n="app"),-1!==n.indexOf("template")&&(n="template"),-1!==n.indexOf("jobs")&&(n="jobs"),-1!==n.indexOf("inventory")&&(n="inventory"),-1!==n.indexOf("settings")&&(n="settings"),-1!==n.indexOf("job")&&-1==n.indexOf("jobs")&&(o=n.match(/\d+/)[0],n="job"),Core.loadModule(n,o)}n()});