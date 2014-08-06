var gulp = require('gulp')
var react = require('gulp-react')
var browserify = require('browserify')
var source = require('vinyl-source-stream')
var connect = require('gulp-connect')

gulp.task('jsx', function() {
  return gulp.src(['example/**/*.js', 'lib/**/*.js'])
    .pipe(react())
    .pipe(gulp.dest('tmp/jsx'))
})

gulp.task('browserify', ['jsx'], function() {
  return browserify({
      entries: ['./tmp/jsx/example.js'],
      debug: true
    })
    .bundle()
    .pipe(source('example.js'))
    .pipe(gulp.dest('build'))
})

gulp.task('static', function () {
  return gulp.src(['example/**/*.css', 'example/**/*.html'])
    .pipe(gulp.dest('build'))
})

gulp.task('server', function() {
  connect.server({
    root: ['build'],
    port: process.env.PORT || 1337
  })
})

gulp.task('default', ['browserify'])

gulp.task('serve', ['static', 'browserify', 'server'], function() {
  gulp.watch(['example/**/*'], ['static', 'browserify'])
  gulp.watch(['lib/**/*'], ['browserify'])
})

