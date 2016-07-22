var gulp = require('gulp');
var uglify = require('gulp-uglify');
//var htmlreplace = require('gulp-html-replace');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var streamify = require('gulp-streamify');
var babelify = require('babelify');
var path = require('path');
var del = require('del');
var jshint = require('gulp-jshint');
var nodemon = require('gulp-nodemon');
var livereload = require('gulp-livereload');
var gutil = require('gulp-util');

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

gulp.task('lint', function () {
  gulp.src('./views/**/*.js')
    .pipe(jshint())
})

gulp.task('develop', function () {
  nodemon({ script: './linkgoLab.js'
          , ext: 'js'
          , ignore: ['./gulpfile.js', './dist/', './views/', './public/']
          , tasks: ['lint'] })
    .on('restart', function () {
      console.log('restarted!')
    })
})

gulp.task('watch', function() {
  //livereload.listen();

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
      b.transform("babelify", {presets: ["es2015", "react"]})
      .bundle().on('error', function(err) {
        gutil.log("Browserify Error", gutil.colors.yellow(err.message));
        this.emit('end');
      })
      .pipe(source(name))
      .pipe(gulp.dest(env.DEST));

      console.log("bundled", e);
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

gulp.task('default', ['copy', 'watch', 'develop']);
