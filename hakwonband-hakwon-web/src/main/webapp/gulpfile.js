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
			'./bower_components/jquery/dist/jquery.min.js'
			, './bower_components/jquery.cookie/jquery.cookie.js'
			, './bower_components/angular/angular.min.js'
			, './bower_components/angular-route/angular-route.min.js'
			, './bower_components/angular-resource/angular-resource.min.js'
			, './bower_components/angular-animate/angular-animate.min.js'
			, './bower_components/angular-sanitize/angular-sanitize.min.js'
			, './bower_components/angular-touch/angular-touch.min.js'
			, './bower_components/angular-i18n/angular-locale_ko-kr.js'
			, './bower_components/angular-bootstrap/ui-bootstrap.min.js'

			, './bower_components/moment/min/moment.min.js'
			, './bower_components/underscore/underscore-min.js'

			, './inspinia/js/bootstrap.min.js'
			, './inspinia/js/bootstrap-modal.js'
			, './inspinia/js/inspinia.js'
			, './inspinia/js/plugins/fullcalendar/fullcalendar.min.js'
			, './inspinia/js/plugins/fullcalendar/moment.min.js'
			, './inspinia/js/plugins/slimscroll/jquery.slimscroll.js'
			, './inspinia/js/plugins/metisMenu/jquery.metisMenu.js'
			, './inspinia/js/plugins/iCheck/icheck.min.js'
			, './inspinia/js/plugins/datapicker/bootstrap-datepicker.js'
			, './inspinia/js/plugins/switchery/switchery.js'

			, './js/lib/tmpl/jquery.tmpl.min.js'
			, './js/lib/bootpag/jquery.bootpag.min.js'
			, './js/lib/date.js'
		]
		, attendance_lib_js : [
   			'./bower_components/jquery/dist/jquery.min.js'
   			, './inspinia/js/bootstrap.min.js'
   			, './inspinia/js/bootstrap-modal.js'
   			, './inspinia/js/inspinia.js'
   			, './inspinia/js/plugins/slimscroll/jquery.slimscroll.js'
   			, './inspinia/js/plugins/metisMenu/jquery.metisMenu.js'
   			, './js/common/common.prototype.js'
   		]
		, inspinia_css : [
			'./inspinia/css/**/*'
		]
		, tinymce_lib : [
  			'./js/lib/tinymce-4.1.7/**/*'
  		]
		, main_module : [
			'./js/common/common.prototype.js'

			, './js/common/common.js'
			, './js/common/bumworld.html5.upload.js'
			, './js/tmpl/hakwonTmpl.js'

			, './js/module/main/hakwonMainApp.js'
			, './js/module/factories/CommUtil.js'

			, './js/module/main/base.js'
			, './js/module/main/index.js'
			, './js/module/main/main.js'
			, './js/module/main/edBanner.js'
			, './js/module/main/event.js'
			, './js/module/main/member.js'
			, './js/module/main/master.js'
			, './js/module/main/hakwon.js'
			, './js/module/main/messageSend.js'
			, './js/module/main/messageView.js'
			, './js/module/main/class.js'
			, './js/module/main/notice.js'
			, './js/module/main/parent.js'
			, './js/module/main/student.js'
			, './js/module/main/teacher.js'
			, './js/module/main/setting.js'
			, './js/module/main/adminQuestion.js'
			, './js/module/main/attendance.js'
			, './js/module/main/receipt.js'
			, './js/module/main/counsel.js'
			, './js/module/main/noticeShare.js'
		]
		, index_module : [
 			'./js/common/common.prototype.js'
 			, './js/common/common.js'
 			, './js/common/bumworld.html5.upload.js'
 			, './js/tmpl/hakwonTmpl.js'

 			, './js/module/main/hakwonMainApp.js'
 			, './js/module/index/hakwonCommonApp.js'
			, './js/module/factories/CommUtil.js'

 			, './js/module/index/index.js'
 			, './js/module/index/login.js'
 			, './js/module/index/signUp.js'
 			, './js/module/index/findInfo.js'
 		]
		, main_lib_css: [
			'./inspinia/css/bootstrap.min.css'
			, './inspinia/css/plugins/iCheck/custom.css'
			, './inspinia/css/animate.css'
			, './inspinia/css/style.min.css'
			, './inspinia/css/hakwon_style.css'

			, './inspinia/css/plugins/switchery/switchery.css'
			, './inspinia/css/plugins/fullcalendar/fullcalendar.min.css'
			, './inspinia/css/plugins/fullcalendar/fullcalendar.print.css'
		]
		, index_lib_css: [
 			'./inspinia/css/bootstrap.min.css'
 			, './inspinia/css/plugins/iCheck/custom.css'
 			, './inspinia/css/animate.css'
 			, './inspinia/css/style.min.css'
 		]
		, partials: [
			'./js/partials/**/*'
		]
		, images: [
			'./inspinia/img/**/*'
			, './images/**/*'
		]
		, fonts: [
			'./inspinia/fonts/*'
		]
		, font_awesome: [
			'./inspinia/font-awesome/**/*'
		]
		, zeroClipboard: [
			'./js/lib/zeroClipboard/**/*'
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
		.pipe(gulp.dest('./assets/img'));
});

// fonts
gulp.task('fonts', function() {
	return gulp.src(paths.fonts)
		.pipe(gulp.dest('./assets/fonts'));
});
gulp.task('font_awesome', function() {
	return gulp.src(paths.font_awesome)
		.pipe(gulp.dest('./assets/font-awesome'));
});


gulp.task('zeroClipboard', function() {
	return gulp.src(paths.zeroClipboard)
	.pipe(gulp.dest('./assets/js/lib/zeroClipboard'));
});

// css
gulp.task('main_lib_css_live', function() {
	return gulp.src(paths.main_lib_css)
//		.pipe(minifyCSS())
		.pipe(concat('main.lib.min.css'))
		.pipe(gulp.dest('./assets/css'));
});

gulp.task('main_lib_css_development', function() {
	return gulp.src(paths.main_lib_css)
		.pipe(concat('main.lib.min.css'))
		.pipe(gulp.dest('./assets/css'));
});

//css
gulp.task('index_lib_css_live', function() {
	return gulp.src(paths.index_lib_css)
//		.pipe(minifyCSS())
		.pipe(concat('index.lib.min.css'))
		.pipe(gulp.dest('./assets/css'));
});

gulp.task('index_lib_css_development', function() {
	return gulp.src(paths.index_lib_css)
		.pipe(concat('index.lib.min.css'))
		.pipe(gulp.dest('./assets/css'));
});

// common_libraries
gulp.task('common_lib_js', function() {
	return gulp.src(paths.common_lib_js)
		.pipe(concat('common.lib.min.js'))
		.pipe(ngmin())
		.pipe(uglify())
		.pipe(gulp.dest('./assets/js'));
});

gulp.task('attendance_lib_js', function() {
	return gulp.src(paths.attendance_lib_js)
		.pipe(concat('attendance.lib.min.js'))
		.pipe(ngmin())
		.pipe(uglify())
		.pipe(gulp.dest('./assets/js'));
});


//libraries
gulp.task('inspinia_css', function() {
	return gulp.src(paths.inspinia_css)
		.pipe(gulp.dest('./assets/css'));
});
gulp.task('tinymce_lib', function() {
	return gulp.src(paths.tinymce_lib)
		.pipe(gulp.dest('./assets/tinymce'));
});


// for angular-app
gulp.task('main_module_live', function() {
	return gulp.src(paths.main_module)
		.pipe(concat('main.module.min.js'))
		.pipe(ngmin())
		//.pipe(uglify({mangle:false}))
		.pipe(gulp.dest('./assets/js'));
});

gulp.task('main_module_development', function() {
	return gulp.src(paths.main_module)
		.pipe(gulp.dest('./assets/js/main_module'));
});

gulp.task('index_module_live', function() {
	return gulp.src(paths.index_module)
		.pipe(concat('index.module.min.js'))
		.pipe(ngmin())
		//.pipe(uglify({mangle:false}))
		.pipe(gulp.dest('./assets/js'));
});

gulp.task('index_module_development', function() {
	return gulp.src(paths.index_module)
		.pipe(gulp.dest('./assets/js/index_module'));
});

// watch
gulp.task('watch', function() {
	gulp.watch(paths.partials.concat(paths.root), ['partials']);
	gulp.watch(paths.images, ['images']);
	gulp.watch(paths.fonts, ['fonts']);
	gulp.watch(paths.font_awesome, ['font_awesome']);
	gulp.watch(paths.zeroClipboard, ['zeroClipboard']);
	gulp.watch(paths.common_lib_js, ['common_lib_js']);
	gulp.watch(paths.attendance_lib_js, ['attendance_lib_js']);
	gulp.watch(paths.main_lib_js, ['main_lib_js']);
	gulp.watch(paths.main_lib_css, ['main_lib_css_development']);
	gulp.watch(paths.main_module, ['main_module_development']);
});


gulp.task('gulpfile.js', ['default']);

gulp.task('default', ['clean', 'build:development'], function() {
	gulp.start('watch');
});

gulp.task('build', ['clean'], function() {
	gulp.start('images', 'fonts', 'font_awesome', 'zeroClipboard', 'common_lib_js', 'attendance_lib_js', 'inspinia_css', 'tinymce_lib', 'index_lib_css_live', 'main_lib_css_live', 'partials', 'index_module_live', 'main_module_live');
});

gulp.task('build:development', ['clean'], function() {
	gulp.start('images', 'fonts', 'font_awesome', 'zeroClipboard', 'common_lib_js', 'attendance_lib_js', 'inspinia_css', 'tinymce_lib', 'index_lib_css_development', 'main_lib_css_development', 'partials', 'index_module_development', 'main_module_development');
});