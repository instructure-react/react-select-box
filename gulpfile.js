var gulp = require('gulp')
var browserify = require('browserify')
var source = require('vinyl-source-stream')
var connect = require('gulp-connect')

gulp.task('browserify', function() {
  return browserify({
      entries: ['./example.js'],
      debug: true
    })
    .bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest('.'))
})

gulp.task('default', ['browserify'])
