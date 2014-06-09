'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var htmlmin = require('gulp-htmlmin');
var livereload = require('gulp-livereload');
var react = require('gulp-react');

var path = {
  src:  function(path) {
    return './src/' + path;
  },
  dist: function(path) {
    return './dist/' + path;
  },
};

var scripts = path.src('scripts/**/*.js');

// HTML
gulp.task('html', function() {
  return gulp.src(path.src('**/*.html'))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(path.dist('')));
});
//
// Scripts
gulp.task('scripts-jshint', function() {
  return gulp.src(scripts)
    .pipe(react())
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'));
});

// Build
gulp.task('build', ['html', 'scripts-jshint']);

// Default task
gulp.task('default', function() {
  gulp.start('build');
});

// Watch
gulp.task('watch', ['build'], function() {

  livereload();

  // Watch for changes to dist
  gulp.watch(path.dist('**/*'), function(event) {
     console.log('File changed:', event.path);

     return gulp.src(event.path)
       .pipe(livereload());
  });

  // Watch .html files and re-process, which will trigger LiveReload above
  gulp.watch(path.src('**/*.html'), ['html']);

  // // Watch .scss files and re-process, which will trigger LiveReload above
  // gulp.watch(path.src('styles/**/*.scss'), ['styles']);

  // Watch .js files
  gulp.watch(scripts, ['scripts-jshint']);

  // // Watch image files and re-process, which will trigger LiveReload above
  // gulp.watch(path.src('images/**/*'), ['images']);
});
