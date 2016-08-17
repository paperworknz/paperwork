// Dependencies
var gulp	= require('gulp');
var babel	= require('gulp-babel');
var sass	= require('gulp-sass');
var uncss	= require('gulp-uncss');
var inline	= require('gulp-inline-css');
var uglify	= require('gulp-uglify');
var concat	= require('gulp-concat');
var clean	= require('gulp-clean-css');
var jeditor	= require('gulp-json-editor');
var connect = require('gulp-connect');
var open	= require('gulp-open');
var prefix	= require('gulp-autoprefixer');
var exec	= require('child_process').exec;

// Constants
var path = {
	'css_cache'	: 'app/app/resources/.css-cache',
	'js_cache'	: 'app/app/resources/.js-cache',
	'template_cache': 'app/app/resources/.template-cache',
	'bootstrap'	: 'public/css/3rd/bootstrap.3.3.6.css',
	'jquery'	: 'public/js/3rd/jquery.2.1.4.js',
	'astral'	: 'C:\\Bitnami\\wampstack-7.0.0-0\\apache2\\htdocs\\paperwork\\_Astral\\js.php',
};

// WATCH //
gulp.task('watch', function(){
	// Library, modules css
	gulp.watch('app/views/other/css/*/*.scss').on('change', function(file){
		css(file);
	});
	
	// Views css
	gulp.watch('app/views/other/css/views/*/*.scss').on('change', function(file){
		css(file);
	});
	
	// Library, classes js
	gulp.watch(['app/views/other/js/library/*.js', 'app/views/other/js/classes/*/*.js']).on('change', function(file){
		libraryJS(file);
	});
	
	// Core
	gulp.watch(['app/views/other/js/core/Core.js']).on('change', function(file){
		js(file);
	});
	
	// Modules, behaviors js
	gulp.watch(['app/views/other/js/modules/*/*.js', 'app/views/other/js/behaviors/*/*.js', 'app/views/other/js/services/*/*.js']).on('change', function(file){
		js(file);
	});
	
	// Templates
	gulp.watch(['app/views/other/templates/*.html']).on('change', function(file){
		template(file);
	});
	
	// Template inline css
	gulp.watch(['app/views/other/templates/inline/sass/*.scss']).on('change', function(file){
		templateInlineSASS(file);
	});
	
	// Template public css
	gulp.watch(['app/views/other/templates/public/*.scss']).on('change', function(file){
		templatePublicSASS(file);
	});
});

// Update JSON, generates and appends ?xxxxxx to value
function updateCache(src, key, value){
	var result = '',
		chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
		dest = '';
	
	// Generate random string (length 6)
	for(var i = 6; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
	
	var value = value + '?' + result; // JSON value (key: value)
	var shards = src.split('/'); // Destination
	
	shards.pop(); // Remove name from shards
	for(var i = 0; i < shards.length; i++) dest += shards[i] + '/';
	
	// Update JSON
	gulp.src(src)
		.pipe(jeditor(function(json){
			
			arr = key.split('.');
			
			if(arr[1]){
				json[arr[0]][arr[1]] = value;
			}else{
				json[arr[0]] = value;
			}
			
			return json;
		}))
		.pipe(gulp.dest('app/app/resources'));
	
	return;
}

// Deconstruct file path, return semantic values
function deconstruct(file, data){
	
	var file_name = file.path.replace(/^.*[\\\/]/, ''),
		shards = file.path.split('\\'),
		dir = [],
		path = '',
		delimiter = '',
		display_name;
	
	// Full name as an array starting at name.scss
	shards.reverse();
	
	// Delimination
	// Loop through shards to make dir path
	for(i = 0; i < shards.length; i++){
		if(shards[i] !== data.delimiter){
			if(shards[i] != file_name) dir.push(shards[i]);
		}else{
			break; // End loop once we hit delimiter
		}
	}
	
	// Reverse directory array to it's natural form (eg. one,two,three)
	dir.reverse();
	
	// If there are directories, loop and concat into a string
	if(dir.length > 0){
		delimiter = dir[0] || dir;
		dir.splice(0, 1);
		for(i=0; i < dir.length; i++) path += (dir[i] + '/');
	}else{
		delimiter = dir[0] || dir;
		path = '';
	}
	
	// Display name
	var log_name = path == '/' ? (file_name) : (path + file_name);
	
	return {
		name: file_name,
		delimiter: delimiter,
		path: path,
		fqn: file.path,
		log_name: log_name,
	}
}

function css(file){
	
	var file = deconstruct(file, {
		delimiter: 'css',
	});
	
	// Update .css-cache
	updateCache(
		path.css_cache,
		(file.delimiter + '.' + file.log_name.split('.scss')[0]),
		(file.log_name.replace('.scss', '.css'))
	);
	
	// Run gulp task with full dir name
	gulp.src(file.fqn)
		.pipe(sass())
		.pipe(prefix())
		.pipe(clean())
		.pipe(gulp.dest('public/css/' + file.delimiter + '/' + file.path));
	
	// Log
	return console.log(file.log_name + ' updated');
}

function js(file){
	
	var file = deconstruct(file, {
		delimiter: 'js',
	});
	
	// Update .js-cache
	updateCache(
		path.js_cache,
		(file.delimiter + '.' + file.name.split('.js')[0]),
		(file.name)
	);
	
	// Run gulp task with full dir name
	gulp.src(file.fqn)
		.pipe(babel())
		.pipe(concat(file.name))
		.pipe(uglify())
		.pipe(gulp.dest('public/js/' + file.delimiter));
	
	// Log
	return console.log(file.log_name + ' updated');
	
}

function libraryJS(file){
	
	var file = deconstruct(file, {
		delimiter: 'js',
	});
	
	// Update .js-cache
	updateCache(
		path.js_cache,
		(file.delimiter + '.' + file.name.split('.js')[0]),
		(file.name)
	);
	
	exec('php "' + path.astral + '" ' + file.fqn, function(e, stdout, stderr){
		// Run gulp task with full dir name
		gulp.src(stdout)
			.pipe(babel())
			.pipe(concat(file.name))
			.pipe(uglify())
			.pipe(gulp.dest('public/js/' + file.delimiter));
		
		// Log
		return console.log(file.log_name + ' updated');
	});
	
}

function template(file){
	
	var file = deconstruct(file, {
		delimiter: 'templates',
	});
	
	gulp.src(path.template_cache)
		.pipe(jeditor(function(json){
			json[file.name.split('.html')[0]] = file.name;
			return json;
		}))
		.pipe(gulp.dest('app/app/resources'));
	
	gulp.src(file.fqn)
		.pipe(inline({
			// url: 'http://',
			applyStyleTags: true,
			removeStyleTags: true,
			applyLinkTags: true,
			removeLinkTags: true,
			removeHtmlSelectors: true,
		}))
		.pipe(gulp.dest('app/app/storage/templates'));
	
	return console.log(file.log_name + ' updated');
}

function templateInlineSASS(file){
	
	var file = deconstruct(file, {
		delimiter: 'sass',
	});
	
	// Run gulp task with full dir name
	gulp.src(file.fqn)
		.pipe(sass())
		.pipe(prefix())
		.pipe(clean())
		.pipe(gulp.dest('app/views/other/templates/inline/css/'));
	
	return console.log(file.log_name + ' updated');
}

function templatePublicSASS(file){
	
	var file = deconstruct(file, {
		delimiter: 'sass',
	});
	
	// Run gulp task with full dir name
	gulp.src(file.fqn)
		.pipe(sass())
		.pipe(prefix())
		.pipe(clean())
		.pipe(gulp.dest('public/css/templates/'));
	
	return console.log(file.log_name + ' updated');
}