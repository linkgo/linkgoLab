var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
//var htmlreplace = require('gulp-html-replace');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var streamify = require('gulp-streamify');
var babelify = require('babelify');
var path = require('path');
var del = require('del');

var env = {
  VIEWS: ['./views/*.jade', './views/**/*.jade'],
  VENDORS: [
    './AdminLTE/dist/**/**',
    './AdminLTE/bootstrap/**/**',
  ],
  DEST: 'dist',
  DEST_VIEWS: 'dist/views',
  DEST_VENDORS: 'dist/vendors',
  ENTRY_POINTS: [
    './views/newLink/newLink.js',
    './views/neuriteSensor/neuriteSensor.js',
  ],
};

gulp.task('copy', function(){
  gulp.src(env.VIEWS)
    .pipe(gulp.dest(env.DEST_VIEWS));
  gulp.src(['./AdminLTE/dist/**/**'])
    .pipe(gulp.dest('./dist/vendors/AdminLTE'));
  gulp.src(['./AdminLTE/bootstrap/**/**'])
    .pipe(gulp.dest('./dist/vendors/bootstrap'));
  gulp.src(['./node_modules/jquery/dist/**'])
    .pipe(gulp.dest('./dist/vendors/jquery'));
  gulp.src(['./node_modules/jquery.cookie/jquery.cookie.js'])
    .pipe(gulp.dest('./dist/vendors/jquery.cookie'));
});

gulp.task('watch', function() {
  gulp.watch(env.VIEWS, ['copy']);

  env.ENTRY_POINTS.forEach(function(e, i, a) {
    var b = watchify(browserify({
      entries: e,
      cache: {},
      debug: true
    }));

    b.on('update', bundle);
    bundle();

    function bundle() {
      //var name = path.basename(e);
      var name = e;
      console.log("bundle");
      b.transform("babelify", {presets: ["es2015", "react"]})
      .bundle()
      .pipe(source(name))
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
      //var name = path.basename(e, '.js') + '.min.js';
      var name = e;
      console.log("bundle", name);
      b.transform("babelify", {presets: ["es2015", "react"]})
      .bundle()
      .pipe(source(name))
      .pipe(streamify(uglify()))
      .pipe(gulp.dest(env.DEST))
    }
  });
});

gulp.task('clean', function() {
  del([env.DEST]).then(function(paths) {
    console.log("del", paths.join('\n'));
  });
});

gulp.task('default', ['copy', 'watch']);
