var merge		= require('merge-stream'),
	gulp		= require('gulp'),
	concat		= require('gulp-concat'),
	uglify		= require('gulp-uglify'),
	rimraf		= require('gulp-rimraf'),
	ngmin		= require('gulp-ngmin'),
	minifyCSS	= require('gulp-minify-css'),
	minifyHTML	= require('gulp-minify-html'),

	paths = {
		root: []
		, common_lib_js : [
			'./js/lib/jquery-2.1.1/jquery-2.1.1.min.js'
			, './js/lib/tmpl/jquery.tmpl.min.js'
			, './bower_components/jquery.cookie/jquery.cookie.js'
			, './js/lib/ezmark-1.0/jquery.ezmark.min.js'
			, './js/lib/merge.js'
			, './js/lib/underscore-1.7.0/underscore-min.js'
			, './js/lib/moment.js'
			, './bower_components/angular/angular.min.js'
			, './bower_components/angular-route/angular-route.min.js'
			, './bower_components/angular-touch/angular-touch.min.js'
			, './js/common/common.prototype.js'
			, './js/common/common.js'
			, './js/common/bumworld.html5.upload.js'
		]
		, module_js : [
			'./js/common/hakwonApp.js'
			, './js/tmpl/hakwonTmpl.js'
			, './js/module/factory/CommUtil.js'
			, './js/module/index.js'
			, './js/module/login.js'
			, './js/module/signUp.js'
			, './js/module/userMain.js'
			, './js/module/member.js'
			, './js/module/message.js'
			, './js/module/attendanceList.js'
			, './js/module/hakwon/hakwon.js'
			, './js/module/hakwon/teacher.js'
			, './js/module/hakwon/notice.js'
			, './js/module/hakwon/event.js'
			, './js/module/advertise.js'
		]
		, css_markup: './css/**/*'
		, partials: [
			'./js/partials/**/*'
		]
		, images: [
			'./images/**/*'
		]
	};




// clean to assets dir
gulp.task('clean', function() {
	return gulp.src(['./assets'], { read: false })
		.pipe(rimraf({ force: true }));
});

// html
gulp.task('partials', function() {
	return gulp.src(paths.partials)
		.pipe(gulp.dest('./assets/partials'));
});

// image
gulp.task('images', function() {
	return gulp.src(paths.images)
		.pipe(gulp.dest('./assets/images'));
});

gulp.task('css_markup', function() {
	return gulp.src(paths.css_markup)
		.pipe(gulp.dest('./assets/css'));
});

// common_libraries
gulp.task('common_lib_js', function() {
	return gulp.src(paths.common_lib_js)
		.pipe(concat('common.lib.min.js'))
		.pipe(ngmin())
		.pipe(uglify({mangle:false}))
		.pipe(gulp.dest('./assets/js'));
});
gulp.task('module_js', function() {
	return gulp.src(paths.module_js)
		.pipe(concat('module.min.js'))
		.pipe(ngmin())
		.pipe(uglify({mangle:false}))
		.pipe(gulp.dest('./assets/js'));
});


// watch
gulp.task('watch', function() {
	gulp.watch(paths.partials.concat(paths.root), ['partials']);
	gulp.watch(paths.common_lib_js, ['common_lib_js']);
	gulp.watch(paths.module_js, ['module_js']);
	gulp.watch(paths.images, ['images']);
	gulp.watch(paths.css_markup, ['css_markup']);
});


gulp.task('gulpfile.js', ['default']);

gulp.task('default', ['clean', 'build:development'], function() {
	gulp.start('watch');
});

gulp.task('build', ['clean'], function() {
	gulp.start('images', 'common_lib_js', 'module_js', 'css_markup', 'partials');
});

gulp.task('build:development', ['clean'], function() {
	gulp.start('images', 'common_lib_js', 'module_js', 'css_markup', 'partials');
});