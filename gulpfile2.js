'use strict';

var gulp = require('gulp');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var browserify = require('browserify');

// Load plugins
var plugins = require('gulp-load-plugins')();

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
  console.log('html');
  return gulp.src(path.src('**/*.html'))
    .pipe(plugins.htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(path.dist('')));
});

// Styles
gulp.task('styles', function() {
  return gulp.src(path.src('styles/main.scss'))
    .pipe(plugins.rubySass({
      style: 'expanded',
      quiet: true
    }))
    .pipe(plugins.autoprefixer('last 2 versions', 'Explorer >= 8'))
    .pipe(gulp.dest(path.src('styles')))
    .pipe(plugins.csso())
    .pipe(plugins.rename({suffix: '.min'}))
    .pipe(gulp.dest(path.dist('styles')))
    .pipe(plugins.size());
});

// Scripts
gulp.task('scripts', ['scripts-main', 'scripts-jshint', 'scripts-old-ie', 'scripts-modernizr']);
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
gulp.task('scripts-old-ie', function() {
  //gulp.src([path.src('scripts/vendor/respond.min.js')])
  //  .pipe(plugins.concat('old-ie.min.js'))
  //  .pipe(plugins.uglify())
  //  .pipe(gulp.dest(path.dist('scripts')))
  //  .pipe(plugins.size());
});
gulp.task('scripts-modernizr', function() {
  // gulp-modernizr hasn’t hit npm yet.
  gulp.src([path.src('styles/main.scss'), path.src('styles/app/**/*.scss'), path.src('scripts/main.js')])
  .pipe(plugins.modernizr({
    excludeTests: ['hidden', 'picture']
  }))
  .pipe(plugins.uglify())
  .pipe(plugins.rename('modernizr.min.js'))
  .pipe(gulp.dest(path.dist('scripts')))
  .pipe(plugins.size());
});


// Images
gulp.task('images', ['images-imagemin', 'images-svgmin', 'images-no-svg-fallback']);

// Reusable imagemin function
function imagemin() {
  return plugins.cache(plugins.imagemin({
    optimizationLevel: 3,
    progressive: true,
    interlaced: true
  }));
}

gulp.task('images-imagemin', ['images-no-svg-fallback'], function() {
  return gulp.src([path.src('images/**/*'), '!*.svg'])
    .pipe(imagemin())
    .pipe(gulp.dest(path.dist('images')))
    .pipe(plugins.size());
});
gulp.task('images-svgmin', function() {
  return gulp.src(path.src('images/**/*.svg'))
    .pipe(plugins.cache(plugins.svgmin()))
    .pipe(gulp.dest(path.dist('images')))
    .pipe(plugins.size());
});
gulp.task('images-no-svg-fallback', function() {
  return gulp.src(path.src('images/**/*.svg'))
    .pipe(plugins.raster())
    .pipe(plugins.rename({extname: '.png'}))
    .pipe(imagemin())
    .pipe(gulp.dest(path.dist('images')))
    .pipe(plugins.size());
});


// Fonts - Copies fonts to fonts dir (for Bootstrap glyphicons)
gulp.task('fonts', function() {
  //return gulp.src(path.src('styles/bootstrap-sass/vendor/assets/fonts/bootstrap/*.{ttf,woff,eot,svg}'))
  //  .pipe(gulp.dest(path.dist('/fonts')));
});


// Clean
gulp.task('clean', function() {
  return gulp.src([
    path.dist('styles'),
    path.dist('scripts'),
    path.dist('fonts'),
    path.dist('images')
  ], {read: false}).pipe(plugins.clean());
});


// Build
gulp.task('build', ['html', 'styles', 'scripts', 'images', 'fonts']);

// Default task
gulp.task('default', ['clean'], function() {
  gulp.start('build');
});

gulp.task('blah', function() {
  console.log('blah');
  gulp.watch('./dist/scripts/main.min.js', function(event) {
    console.log('a');
    console.log(event);
  });
});

// Watch
gulp.task('watch', ['watchify-enable-watching', 'build'], function() {
  console.log('Watching');

  // plugins.livereload();

  gulp.watch('./dist/**/*.*', function(event) {
    console.log('b');
  });

  // // Watch for changes
  // gulp.watch([
  //   'dist/index.html'
  //   //path.dist('*.html'),
  //   //path.dist('styles/main.min.css'),
  //   //path.dist('scripts/main.min.js'),
  //   //path.dist('images/**/*')
  // ], function(event) {
  //   console.log('File changed:', event.path);

  //   return gulp.src(event.path)
  //   .pipe(plugins.livereload());
  // });

  // // Watch .html files and re-process, which will trigger LiveReload above
  // gulp.watch(path.src('index.html'), ['html']);

  // // Watch .scss files and re-process, which will trigger LiveReload above
  // gulp.watch(path.src('styles/**/*.scss'), ['styles']);

  // // Watch .js files for jshint
  // gulp.watch(path.src('scripts/**/*.js'), ['scripts-jshint']);

  // // Watch image files and re-process, which will trigger LiveReload above
  // gulp.watch(path.src('images/**/*'), ['images']);
});


// Watch
//gulp.task('watch-simple', ['build'], function() {
//
//  // Watch .scss files and re-process
//  gulp.watch(path.src('styles/**/*.scss'), ['styles']);
//
//  // Watch .js files and re-process
//  gulp.watch(path.src('scripts/**/*.js'), ['scripts']);
//
//  // Watch image files and re-process
//  gulp.watch(path.src('images/**/*'), ['images']);
//});
