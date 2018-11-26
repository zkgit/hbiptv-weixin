// 引入 gulp
var gulp = require('gulp'),
	concat = require('gulp-concat'),
	watch = require('gulp-watch'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	minifycss = require('gulp-minify-css');
// 引入组件

// 合并，压缩文件
gulp.task('minjs',function(){
	gulp.src(['scripts/*.js','scripts/controller/*.js'])
		.pipe(concat('lib.js'))
		.pipe(gulp.dest('dest'))
})
//mincss任务会合并styles/ 目录下得所有得css文件并输出到 dist/ 目录，然后gulp会重命名、压缩合并的文件，也输出到 dist/ 目录。
gulp.task('mincss',function(){
	gulp.src('styles/*.css')
		.pipe(concat('style.css'))
		.pipe(gulp.dest('dest'))
		.pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
        .pipe(minifycss())    //压缩
        .pipe(gulp.dest('dest'));  //输出
})
gulp.task('watchjs',function(){
	//使用 .watch() 方法去监听指定目录的文件变化，当有文件变化时，会运行回调定义的其他任务。
	gulp.watch(['scripts/*.js','scripts/controller/*.js'], ['minjs']);
})
gulp.task('watchcss',function(){
	gulp.watch(['styles/*.css'], ['mincss']);
})
