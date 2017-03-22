var gulp = require('gulp');
var gulpif = require('gulp-if');
var argv = require('yargs').argv;
var autoprefixer = require('gulp-autoprefixer');
var less = require('gulp-less');
var csso = require('gulp-csso');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var jshint = require('gulp-jshint');

gulp.task('build-css', function() {
    return gulp.src('assets/less/**/*.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(gulpif(argv.production, csso()))
        .pipe(gulp.dest('public/css'));
});

gulp.task('build-js', function() {
    return gulp.src('assets/js/**/*.js')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(gulpif(argv.production, uglify()))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/js'));
});

gulp.task('jshint', function() {
    return gulp.src('assets/js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('watch', function() {
    gulp.watch('assets/less/**/*.less', ['build-css']);
    gulp.watch('assets/js/**/*.js', ['build-js']);
});

gulp.task('build', ['build-css', 'build-js', 'jshint']);
gulp.task('default', ['build']);
