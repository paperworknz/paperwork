// Dependencies
var gulp	= require('gulp');
var concat	= require('gulp-concat');
var rename	= require('gulp-rename');
var uglify	= require('gulp-uglify');
var css		= require('gulp-clean-css');
var jeditor	= require('gulp-json-editor');
var del		= require('del');

// Continuous task to watch for changes in Form dir
gulp.task('watch', function(){
	var form = gulp.watch('public/services/Form/Form/**/*.js');
	gulp.start('form-min');
	form.on('change', function(){
		gulp.start('form-min');
	});
});

// Form minification, run on change
gulp.task('form-min', function(){
	
	function randomString(length) {
		var result = '',
			chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		
		for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
		return result;
	}
	
	var name = 'Form.min.'+randomString(6)+'.js'; // Random name Form.min.xxxxxx.js
	del(['public/services/Form/Form.min.*']); // Delete old minified version
	
	// Update .resources
	gulp.src('app/app/.resources')
		.pipe(jeditor(function(json){
			json.form = name;
			return json;
		}))
		.pipe(gulp.dest('app/app/'));
	
	// Concat, minify Form/* using random name var
	gulp.src(['public/services/Form/Form/Core/Core.js', 'public/services/Form/Form/**/*.js'])
		.pipe(concat('Form.js'))
		.pipe(gulp.dest('public/services/Form/'))
		.pipe(rename(name))
		.pipe(uglify())
		.pipe(gulp.dest('public/services/Form/'));
});

// Postponed job css/js minification tasks

/*gulp.task('job-css', function(){
	return gulp.src([
			'public/inc/paperwork/Paperwork.1.12.css',
			'public/inc/paperwork/views/job/_job.css',
			'public/inc/typeahead/*.css',
			'public/inc/sweetalert/*.css',
		])
		.pipe(concat('min.css'))
		.pipe(gulp.dest('public/inc/paperwork/views/job/'))
		.pipe(css())
		.pipe(gulp.dest('public/inc/paperwork/views/job/'));
});

gulp.task('job-js', function(){
	return gulp.src([
		'public/inc/typeahead/*.js',
		'public/services/Paperwork/*.js',
		'public/services/Tab/Tab.1.2.js',
		'public/services/Typeahead/*.js',
		'public/inc/sweetalert/*.js',
		'public/inc/interact/*.js',
		'public/inc/contextmenu/jquery.contextMenu.js',
	])
		.pipe(concat('min.js'))
		.pipe(gulp.dest('public/inc/paperwork/views/job/'))
		.pipe(uglify())
		.pipe(gulp.dest('public/inc/paperwork/views/job/'));
});

gulp.task('job', ['job-css', 'job-js']);*/