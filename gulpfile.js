// Dependencies
var gulp	= require('gulp');
var babel	= require('gulp-babel');
var each	= require('gulp-foreach');
var concat	= require('gulp-concat');
var rename	= require('gulp-rename');
var uglify	= require('gulp-uglify');
var clean	= require('gulp-clean-css');
var jeditor	= require('gulp-json-editor');
var exec	= require('child_process').exec;

// CONSTANTS //
var path = {
	'css_cache'		:'app/app/resources/.css-cache',
	'js_cache'		:'app/app/resources/.js-cache',
	'paperwork'		:'app/views/other/css/paperwork.css',
	'public'		:'app/views/other/css/public.css',
	'bootstrap'		:'public/css/bootstrap.3.3.6.css',
	'sweetalert'	:'public/css/sweetalert.css',
	'jquery'		:'public/js/jquery.2.1.4.js',
};

function updateCache(src, key, value, length){
	var result = '',
		chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
		dest = '';
	
	// Generate random string, length of 6 by default
	if(length == undefined) length = 6;
	for(var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
	
	// JSON value (key: value)
	var value = value + '?' + result;
	
	// Destination
	var shards = src.split('/');
	shards.pop(); // Remove name from shards
	for(var i = 0; i < shards.length; i++) dest += shards[i]+'/';
	
	// Update JSON
	gulp.src(src)
		.pipe(jeditor(function(json){
			json[key] = value
			return json;
		}))
		.pipe(gulp.dest('app/app/resources'));
	
	
}

function globalCSS(name, filepath, seed){
	
	// Update .css-cache depending on seed
	if(seed !== true) updateCache(path.css_cache, name, name+'.css');
	
	gulp
		.src([
			path.bootstrap,
			path.sweetalert,
			filepath,
		])
		.pipe(concat(name+'.css'))
		.pipe(clean())
		.pipe(gulp.dest('public/css/app/'));
	
	// Log
	console.log(name+'.css updated');
}

function viewCSS(file, seed){
	var file_name	= file.path.replace(/^.*[\\\/]/, ''),
		shards		= file.path.split('\\'),
		dir			= [],
		name		= '';
	
	// Full name as an array starting at name.css
	shards.reverse();
	
	// Loop through shards to make dir path
	for(i=0; i < shards.length; i++){
		if(shards[i] !== 'views'){
			if(shards[i] != file_name){
				dir.push(shards[i]);
			}
		}else{
			break; // End loop once we hit 'views'
		}
	}
	
	// Reverse directory array to it's natural form (eg. one,two,three)
	dir.reverse();
	
	if(dir.length > 0){
		// If there are directories, loop and concat into a string
		for(i=0; i < dir.length; i++){
			name += '/'+dir[i];
		}
	}else{
		name = '/';
	}
	
	// Display name
	if(name == '/'){
		var display_name = '/'+file_name;
	}else{
		var display_name = name+'/'+file_name;
	}
	
	// Update .css-cache depending on seed
	if(seed !== true) updateCache(path.css_cache, 'views'+display_name.split('.css')[0], 'views'+display_name);
	
	// Run gulp task with full dir name
	gulp
		.src([
			file.path,
		])
		.pipe(concat(file_name))
		.pipe(clean())
		.pipe(gulp.dest('public/css/app/views'+name));
	
	// Log
	if(name == '/'){
		console.log(display_name+' updated');
	}else{
		console.log(display_name+' updated');
	}
}

function paperworkJS(name, file, seed){
	
	// Update .js-cache depending on seed
	if(seed !== true) updateCache(path.js_cache, name, name+'.js');
	
	gulp
		.src([
			path.jquery,
			file,
		])
		.pipe(babel())
		.pipe(concat(name+'.js'))
		.pipe(uglify())
		.pipe(gulp.dest('public/js/app/'));
	
	// Log
	console.log(name+'.js updated');
	
}

function servicesJS(file, seed){
	
	var file_name	= file.path.replace(/^.*[\\\/]/, ''),
		shards		= file.path.split('\\'),
		name;
	
	// Full name as an array starting at name.css
	shards.reverse();
	
	// Name as the js file name
	var display_name = shards[0];
	name = '/'+display_name;
	
	// Update .css-cache depending on seed
	if(seed !== true) updateCache(path.js_cache, display_name.split('.js')[0], 'services/'+display_name);
	
	exec('php "C:\\Bitnami\\wampstack-7.0.0-0\\apache2\\htdocs\\paperwork\\_Astral\\js.php" ' + file.path + ' ' + display_name, function(e, stdout, stderr){
		// Run gulp task with full dir name
		gulp
			.src([
				stdout,
			])
			.pipe(babel())
			.pipe(concat(file_name))
			.pipe(uglify())
			.pipe(gulp.dest('public/js/app/services'));
		
		// Log
		if(name == '/'){
			return console.log(display_name+' updated');
		}else{
			return console.log(display_name+' updated');
		}
	});
	
}

function formJS(seed){
	
	// Update .js-cache depending on seed
	if(seed !== true) updateCache(path.js_cache, 'Form', 'services/Form.js');
	
	gulp
		.src([
			'app/views/other/js/services/Form/Form/Core/Core.js',
			'app/views/other/js/services/Form/Form/**/*.js',
		])
		.pipe(babel())
		.pipe(concat('Form.js'))
		.pipe(uglify())
		.pipe(gulp.dest('public/js/app/services'));
	
	// Log
	console.log('Form.js updated');
	
}

// WATCH //
gulp.task('watch', function(){
	
	// View css
	gulp.watch('app/views/other/css/views/**').on('change', function(file){
		viewCSS(file);
	});
	
	// Services js
	gulp.watch('app/views/other/js/services/*/*.js').on('change', function(file){
		servicesJS(file);
	});
	
	// paperwork.js
	gulp.watch('app/views/other/js/Paperwork.js').on('change', function(){
		paperworkJS('Paperwork', 'app/views/other/js/Paperwork.js');
	});
	
	// paperwork.css
	gulp.watch('app/views/other/css/paperwork.css').on('change', function(){
		globalCSS('paperwork', 'app/views/other/css/paperwork.css');
	});
	
	// public.css
	gulp.watch('app/views/other/css/public.css').on('change', function(){
		globalCSS('public', 'app/views/other/css/public.css');
	});
	
	// Form
	gulp.watch('app/views/other/js/services/Form/Form/**/*.js').on('change', function(file){
		formJS();
	});
	
});

// SEED //
gulp.task('seed', function(){
	globalCSS('paperwork', 'app/views/other/css/paperwork.css', true);
	globalCSS('public', 'app/views/other/css/public.css', true);
	gulp.src('app/views/other/css/views/**')
		.pipe(each(function(stream, file){
			viewCSS(file, true);
			return stream;
		}));
	
	paperworkJS('Paperwork', 'app/views/other/js/Paperwork.js', true);
	formJS(true);
});