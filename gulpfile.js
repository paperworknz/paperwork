// Dependencies
var gulp	= require('gulp');
var babel	= require('gulp-babel');
var sass	= require('gulp-sass');
var uglify	= require('gulp-uglify');
var concat	= require('gulp-concat');
var clean	= require('gulp-clean-css');
var jeditor	= require('gulp-json-editor');
var exec	= require('child_process').exec;

// Constants
var path = {
	'css_cache'	: 'app/app/resources/.css-cache',
	'js_cache'	: 'app/app/resources/.js-cache',
	'bootstrap'	: 'public/css/3rd/bootstrap.3.3.6.css',
	'jquery'	: 'public/js/3rd/jquery.2.1.4.js',
	'astral'	: 'C:\\Bitnami\\wampstack-7.0.0-0\\apache2\\htdocs\\paperwork\\_Astral\\js.php',
};

// WATCH //
gulp.task('watch', function(){
	
	// Library css
	gulp.watch('app/views/other/css/library/*.scss').on('change', function(file){
		libraryCSS(file);
	});
	
	// View css
	gulp.watch('app/views/other/css/views/**').on('change', function(file){
		viewCSS(file);
	});
	
	// Services js
	gulp.watch('app/views/other/js/services/*/*.js').on('change', function(file){
		servicesJS(file);
	});
	
	// Library js
	gulp.watch('app/views/other/js/library/*.js').on('change', function(file){
		libraryJS(file);
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
			json[key] = value
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
		display_name;
	
	// Full name as an array starting at name.scss
	shards.reverse();
	
	// Delimination
	if(data.delimiter){
		// Loop through shards to make dir path
		for(i = 0; i < shards.length; i++){
			if(shards[i] !== data.delimiter){
				if(shards[i] != file_name) dir.push(shards[i]);
			}else{
				break; // End loop once we hit delimiter
			}
		}
	}
	
	// Reverse directory array to it's natural form (eg. one,two,three)
	dir.reverse();
	
	// If there are directories, loop and concat into a string
	if(dir.length > 0){
		for(i=0; i < dir.length; i++) path += (dir[i] + '/');
	}else{
		path = '';
	}
	
	// Display name
	var log_name = path == '/' ? (file_name) : (path + file_name);
	
	return {
		name: file_name,
		path: path,
		fqn: file.path,
		log_name: log_name,
	}
}

function libraryCSS(file){
	
	var file = deconstruct(file, {
		delimiter: 'library',
	});
	
	// Update .css-cache
	updateCache(
		path.css_cache,
		('@' + file.log_name.split('.scss')[0]),
		(file.log_name.replace('.scss', '.css'))
	);
	
	// Run gulp task with full dir name
	gulp.src(file.fqn)
		.pipe(sass())
		.pipe(clean())
		.pipe(gulp.dest('public/css/library/' + file.path));
	
	// Log
	return console.log(file.log_name + ' updated');
}

function viewCSS(file){
	
	var file = deconstruct(file, {
		delimiter: 'views',
	});
	
	// Update .css-cache
	updateCache(
		path.css_cache,
		(file.log_name.split('.scss')[0]),
		(file.log_name.replace('.scss', '.css'))
	);
	
	// Run gulp task with full dir name
	gulp.src(file.fqn)
		.pipe(sass())
		.pipe(clean())
		.pipe(gulp.dest('public/css/views/' + file.path));
	
	// Log
	return console.log(file.log_name + ' updated');
}

function libraryJS(file){
	
	var file = deconstruct(file, {});
	
	// Update .js-cache
	updateCache(
		path.js_cache,
		('@' + file.name.split('.js')[0]),
		(file.name)
	);
	
	exec('php "' + path.astral + '" ' + file.fqn, function(e, stdout, stderr){
		// Run gulp task with full dir name
		gulp.src(stdout)
			.pipe(babel())
			.pipe(concat(file.name))
			.pipe(uglify())
			.pipe(gulp.dest('public/js/library'));
		
		// Log
		return console.log(file.log_name + ' updated');
	});
	
}

function servicesJS(file){
	
	var file = deconstruct(file, {});
	
	// Update .js-cache
	updateCache(
		path.js_cache,
		(file.name.split('.js')[0]),
		(file.name)
	);
	
	exec('php "' + path.astral + '" ' + file.fqn, function(e, stdout, stderr){
		// Run gulp task with full dir name
		gulp.src(stdout)
			.pipe(babel())
			.pipe(concat(file.name))
			.pipe(uglify())
			.pipe(gulp.dest('public/js/services'));
		
		// Log
		return console.log(file.log_name + ' updated');
	});
	
}