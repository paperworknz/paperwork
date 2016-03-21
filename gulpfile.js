// Dependencies
var gulp	= require('gulp');
var concat	= require('gulp-concat');
var rename	= require('gulp-rename');
var uglify	= require('gulp-uglify');
var css		= require('gulp-clean-css');

// Continuous task to watch for changes in Form dir
gulp.task('watch', function(){
	var form = gulp.watch('public/services/Form/Form/**/*.js');
	form.on('change', function(){
		gulp.start('form-min');
	});
});

// Form minification, run on change
gulp.task('form-min', function(){
	return gulp.src(['public/services/Form/Form/Core/Core.js', 'public/services/Form/Form/**/*.js'])
		.pipe(concat('Form.js'))
		.pipe(gulp.dest('public/services/Form/'))
		.pipe(rename('Form.min.js'))
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