var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
//var react = require('gulp-react');
var babel = require('gulp-babel');
//var htmlreplace = require('gulp-html-replace');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var streamify = require('gulp-streamify');
var babelify = require('babelify');
var path = require('path');

var env = {
  HTML: ['./views/*.jade', './views/**/*.jade'],
  JS_VIEWS: ['./views/**/*.js'],
  JS_COMPONENTS: ['./components/*.jsx'],
  ALL: ['./components/*.jsx', './views/**/*.js', './views/*.jade', './views/**/*.jade'],
  OUT: 'build.js',
  MINIFIED_OUT: 'build.min.js',
  DEST_COMPONENTS: 'dist/comps',
  DEST_VIEWS: 'dist/views',
  DEST_BUILD: 'dist/build',
  DEST: 'dist',
  ENTRY_POINTS: [
    './views/newLink/newLink.js',
    './views/neuriteSensor/neuriteSensor.js',
  ],
};

gulp.task('copy', function(){
  gulp.src(env.HTML)
    .pipe(gulp.dest(env.DEST_VIEWS));
});

gulp.task('watch', function() {
  gulp.watch(env.HTML, ['copy']);

  env.ENTRY_POINTS.forEach(function(e, i, a) {
    var b = watchify(browserify({
      entries: e,
      cache: {},
      debug: true
    }));

    b.on('update', bundle);
    bundle();

    function bundle() {
      console.log("bundle");
      b.transform("babelify", {presets: ["es2015", "react"]})
      .bundle()
      .pipe(source(path.basename(e)))
      .pipe(gulp.dest(env.DEST))
    }
  });
});

gulp.task('build', function() {
  env.ENTRY_POINTS.forEach(function(e, i, a) {
    var b = browserify({
      entries: e,
      cache: {},
      debug: true
    });

    bundle();

    function bundle() {
      var name = path.basename(e, '.js') + '.min.js';
      console.log("bundle", name);
      b.transform("babelify", {presets: ["es2015", "react"]})
      .bundle()
      .pipe(source(name))
      .pipe(streamify(uglify()))
      .pipe(gulp.dest(env.DEST))
    }
  });
  
});

gulp.task('default', ['watch']);
