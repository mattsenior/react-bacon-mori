'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');

var path = {
  src:  function(path) {
    return './src/' + path;
  },
  dist: function(path) {
    return './dist/' + path;
  },
};

var scripts = [path.src('scripts/**/*.js'), '!' + path.src('scripts/main.bundle.js')];

// HTML
gulp.task('html', function() {
  console.log('HTML');
  return gulp.src(path.src('**/*.html'))
    //.pipe(plugins.htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(path.dist('')));
});
//
// Scripts
gulp.task('scripts-jshint', function() {
//  console.log('SCRIPTS-JSHINT');

  // JSHint
  return gulp.src(scripts)
  //return gulp.src([path.src('scripts/**/*.js'), '!' + path.src('scripts/main.bundle.js')])
  //return gulp.src(path.src('scripts/main.js'))
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'));
});

// Build
gulp.task('build', ['html', 'scripts-jshint']);
//gulp.task('build', ['html', 'scripts-jshint']);

// // Default task
// gulp.task('default', function() {
//   gulp.start('build');
// });

// Watch
//gulp.task('watch', ['watchify-enable-watching', 'build'], function() {
//gulp.task('watch', ['build'], function() {
gulp.task('watch', function() {

  console.log('WATCHING');
  //  plugins.livereload();

  //  // Watch for changes to dist
  //  gulp.watch([
  //     path.dist('**/*')
  //  //   //path.dist('*.html'),
  //  //   //path.dist('styles/main.min.css'),
  //  //   //path.dist('scripts/main.min.js'),
  //  //   //path.dist('images/**/*')
  //   ], function(event) {
  //     console.log('File changed:', event.path);

  //     return gulp.src(event.path)
  //       .pipe(plugins.livereload());
  //  });

  // Watch .html files and re-process, which will trigger LiveReload above
  //gulp.watch(path.src('**/*.html'), ['html']);

  // // Watch .scss files and re-process, which will trigger LiveReload above
  // gulp.watch(path.src('styles/**/*.scss'), ['styles']);

  // Watch .js files
  gulp.watch(scripts, ['scripts-jshint']);
  //gulp.watch(path.src('scripts/main.js'), ['scripts-jshint']);

  // // Watch image files and re-process, which will trigger LiveReload above
  // gulp.watch(path.src('images/**/*'), ['images']);
});
