'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var browserify = require('browserify');

var path = {
  src:  function(path) {
    return './src/' + path;
  },
  dist: function(path) {
    return './dist/' + path;
  },
};

// Hack to enable/disable watchify watch mode - taken from gulp-watchify official example
var watchifyWatching = false;
gulp.task('watchify-enable-watching', function() {
  watchifyWatching = true;
});


// HTML
gulp.task('html', function() {
  return gulp.src(path.src('**/*.html'))
    .pipe(plugins.htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(path.dist('')));
});

// Scripts
gulp.task('scripts', ['scripts-main', 'scripts-jshint']);
gulp.task('scripts-main', function() {
  var bundler;

  function rebundle() {
    console.log('Rebundling Browserify');

    return bundler.bundle()
      .pipe(source('main.js'))
      .pipe(plugins.streamify(plugins.uglify()))
      .pipe(plugins.rename({suffix: '.min'}))
      .pipe(gulp.dest(path.dist('scripts')));
  }

  if (watchifyWatching) {
    bundler = watchify(path.src('scripts/main.js'));
    bundler.on('update', rebundle);
  } else {
    bundler = browserify(path.src('scripts/main.js'));
  }

  //bundler.transform('partialify');

  return rebundle();
});
gulp.task('scripts-jshint', function() {
  // JSHint
  gulp.src(path.src('scripts/main.js'))
    .pipe(plugins.jshint('.jshintrc'))
    .pipe(plugins.jshint.reporter('default'));
});

// Build
gulp.task('build', ['html', 'scripts']);

// Watch
gulp.task('watch', ['watchify-enable-watching', 'build'], function() {
//gulp.task('watch', ['watchify-enable-watching'], function() {

  //plugins.livereload();

  // Watch for changes
  gulp.watch([
     path.dist('**/*')
  //   //path.dist('*.html'),
  //   //path.dist('styles/main.min.css'),
  //   //path.dist('scripts/main.min.js'),
  //   //path.dist('images/**/*')
   ], function(event) {
     console.log('File changed:', event.path);

     return gulp.src(event.path)
       .pipe(plugins.livereload());
  });

  // Watch .html files and re-process, which will trigger LiveReload above
  gulp.watch(path.src('**/*.html'), ['html']);

  // // Watch .scss files and re-process, which will trigger LiveReload above
  // gulp.watch(path.src('styles/**/*.scss'), ['styles']);

  // Watch .js files for jshint
  gulp.watch(path.src('scripts/**/*.js'), ['scripts-jshint']);

  // // Watch image files and re-process, which will trigger LiveReload above
  // gulp.watch(path.src('images/**/*'), ['images']);
});
