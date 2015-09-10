var gulp = require('gulp');
var typescript = require('gulp-typescript');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var merge = require('merge2');

var tsProject = typescript.createProject({
	declarationFiles: true,
	module: 'system',
	target: 'ES5',
	emitDecoratorMetadata: true,
	experimentalDecorators: true
});

var PATHS = {
	src: {
		ts: 'src/*.ts',
		html: 'src/*.html',
		css: 'src/*.css',
	},
	lib: [
		'bower_components/bootstrap/dist/css/bootstrap.min.css',
		'bower_components/bootstrap/dist/css/bootstrap-theme.min.css',
		'node_modules/angular2/node_modules/traceur/bin/traceur-runtime.js',
		'node_modules/angular2/bundles/angular2.min.js',
		'node_modules/angular2/bundles/http.min.js',
		'node_modules/systemjs/dist/system-csp-production.js',
		'node_modules/systemjs/dist/system-polyfills.js'
	],
	typings: 'node_modules/angular2/bundles/typings/angular2/angular2.d.ts'
};

gulp.task('clean', function (done) {
	var del = require('del');
	del(['dist'], done);
});

gulp.task('ts', function () {
	
	var tsResult = gulp.src([PATHS.src.ts, PATHS.typings])
		.pipe(sourcemaps.init())
		.pipe(typescript(tsProject));

	return merge([
		tsResult.js.pipe(uglify()).pipe(sourcemaps.write()).pipe(gulp.dest('dist')),
		tsResult.dts.pipe(gulp.dest('src'))
	]);
});

gulp.task('html', function () {
	return gulp.src(PATHS.src.html).pipe(gulp.dest('dist'));
});

gulp.task('css', function () {
	return gulp.src(PATHS.src.css).pipe(gulp.dest('dist'));
});

gulp.task('libs', function () {
	return gulp.src(PATHS.lib).pipe(gulp.dest('dist/lib'));
});

gulp.task('build', function() {
	gulp.start('libs', 'html', 'css', 'ts');
});

gulp.task('rebuild', ['clean'], function() {
	gulp.start('build');
});

gulp.task('watch', ['build'], function () {
	gulp.watch(PATHS.src.ts, ['ts']);
	gulp.watch(PATHS.src.html, ['html']);
	gulp.watch(PATHS.src.css, ['css']);
});

gulp.task('default', function() {
	gulp.start('build');
});