var gulp	= require('gulp');
var concat	= require('gulp-concat');
var rename	= require('gulp-rename');
var uglify	= require('gulp-uglify');

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
		.pipe(rename('Form.a.js'))
		.pipe(uglify())
		.pipe(gulp.dest('public/services/Form/'));
});