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

var path = {
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
  ENTRY_POINT: ['./views/newLink/newLink.js']
};

gulp.task('transform', function(){
  gulp.src(path.JS_COMPONENTS)
    .pipe(babel({presets:['es2015', 'react']}))
    .pipe(gulp.dest(path.DEST_COMPONENTS));
  gulp.src(path.JS_VIEWS)
    .pipe(gulp.dest(path.DEST_VIEWS));
});

gulp.task('copy', function(){
  gulp.src(path.HTML)
    .pipe(gulp.dest(path.DEST_VIEWS));
});

gulp.task('watch', function(){
  gulp.watch(path.HTML, ['copy']);

  var b = watchify(browserify({
    entries: path.ENTRY_POINT,
    cache: {},
    packageCache: {},
    debug: true
    //plugin: [watchify]
  }), {poll: true});

  b.on('update', bundle);
  bundle();

  function bundle() {
    console.log("bundle");
    b.transform("babelify", {presets: ["es2015", "react"]})
    .bundle()
    .pipe(source(path.OUT))
    .pipe(gulp.dest(path.DEST_BUILD))
  }
});

gulp.task('build', function(){
  gulp.src(path.JS_COMPONENTS)
    .pipe(babel({presets:['es2015', 'react']}))
    .pipe(concat())
    .pipe(uglify())
    .pipe(gulp.dest(path.DEST_BUILD));
  gulp.src(path.JS_VIEWS)
    .pipe(concat())
    .pipe(uglify())
    .pipe(gulp.dest(path.DEST_BUILD));
});

gulp.task('default', ['watch']);
