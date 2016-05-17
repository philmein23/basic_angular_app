'use strict';
const gulp = require('gulp');
const webpack = require('webpack-stream');
const eslint = require('gulp-eslint');
const gulpProtractorAngular = require('gulp-angular-protractor');
const cp = require('child_process');
let children = [];

let files = ['test/integration/**/*.js', 'server.js', 'app/html/**/*.html'];

gulp.task('lint:test', () => {
  return gulp.src(files)
  .pipe(eslint({
    'useEslintrc': true
  }))
  .pipe(eslint.format());
});

gulp.task('webpack:dev', () => {
  gulp.src('app/js/entry.js')
  .pipe(webpack({
    watch: true,
    devtool: 'source-map',
    output: {
      filename: 'bundle.js'
    }
  }))
  .pipe(gulp.dest('./build'));
});

gulp.task('static:dev', () => {
  gulp.src('app/**/*.html')
  .pipe(gulp.dest('./build'));
});

gulp.task('css:dev', () => {
  gulp.src('app/css/**/*.css')
  .pipe(gulp.dest('./build'));
});

gulp.task('startservers:test', () => {
  children.push(cp.fork('server.js'));
  children.push(cp.spawn('webdriver-manager', ['start']));
});

gulp.task('protractor:test', ['startservers:test', 'build:dev'], function() {
  gulp.src(['test/integration/intro-db-spec.js'])
  .pipe(gulpProtractorAngular({
    'configFile': 'test/integration/config.js',
    'debug': false,
    'autoStartStopServer': true
  }))
  .on('error', function(e) {
    console.log(e);
  })
  .on('end', () => {
    children.forEach((child) => {
      child.kill('SIGTERM');
    });
  });
});

gulp.task('build:dev', ['webpack:dev', 'static:dev', 'css:dev']);
gulp.task('default', ['build:dev', 'lint:test']);
