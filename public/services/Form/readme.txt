Run "gulp watch" while developing

watch: concats all files in Form/* and saves as Form.js and Form.min.js (used if env = dev). Updates .resources, appends ?xxxxxx to Form.min.js so cache refreshes.

This means you can edit files in Form/* (Core, REST, etc) and the gulp task will concat and minify everything to Form.min.js on each save.