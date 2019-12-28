const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const minify = require('gulp-minify');

function style(){
    return gulp.src('./lib/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./lib/css/'))
    .pipe(browserSync.stream());
}

function watch(){
    browserSync.init({
        server:{
            baseDir:'./'
        }
    })
    gulp.watch('./lib/scss/**/*.scss',style)
}

function compress(){
    return gulp.src('lib/js/app.js', { allowEmpty: true }) 
    .pipe(minify({noSource: true}))
    .pipe(gulp.dest('lib/js/'))
}

exports.compress = compress;
exports.default = watch;