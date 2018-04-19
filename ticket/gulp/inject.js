'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var concat = require('gulp-concat');
var $ = require('gulp-load-plugins')();
var series = require('stream-series');
var wiredep = require('wiredep').stream;
var _ = require('lodash');

var browserSync = require('browser-sync');
var series = require('stream-series');

gulp.task('inject-reload', ['inject'], function () {
  browserSync.reload();
});

gulp.task('inject', ['scripts', 'styles'], function () {
  var injectStyles = gulp.src([

    path.join(conf.paths.dist, 'assets/css/bootstrap.min.css'),
    path.join(conf.paths.dist, 'assets/css/bootstrap-extend.min.css'),
    path.join(conf.paths.dist, 'assets/css/style.css')
  ], {
    read: false
  });

  var vendorInjectScripts = gulp.src([
    path.join(conf.paths.dist, 'bower_components/angular.js'),
    path.join(conf.paths.dist, 'bower_components/angular-ui-router.js'),
    path.join(conf.paths.dist, 'bower_components/angular-route.js'),
    path.join(conf.paths.dist, 'bower_components/angular-animate.min.js'),
    path.join(conf.paths.dist, 'bower_components/jquery.js'),

    path.join(conf.paths.dist, 'bower_components/jquery-ui.min.js'),
    path.join(conf.paths.dist, 'bower_components/bootstrap.js'),
    path.join(conf.paths.dist, '/scripts/vendor/bootstrap.min.js')
  ], {
    read: false
  });

  var injectScripts = gulp.src([
    // path.join(conf.paths.dist, '/scripts/**/*.js'),
    path.join(conf.paths.dist, '/scripts/vendor/**/*.js'),
    path.join('!' + conf.paths.dist, '/scripts/vendor/jquery.js'),
    path.join('!' + conf.paths.dist, '/scripts/vendor/jquery.min.js'),
    path.join('!' + conf.paths.dist, '/scripts/vendor/bootstrap.min.js'),
    path.join('!' + conf.paths.src, '/app/**/*.spec.js'),
    path.join('!' + conf.paths.src, '/app/**/*.mock.js'),
  ], {
    read: false
  })
  // .pipe($.angularFilesort()).on('error', conf.errorHandler('AngularFilesort'));

  var injectOptions = {
    //  transform: function(filePath) {
    //  return  filePath ;
    //},
    ignorePath: [conf.paths.src, conf.paths.dist],
    addRootSlash: false
  };

  var injectScripts1 = gulp.src([
    path.join(conf.paths.dist, 'bower_components/jquery.js'),
    path.join(conf.paths.dist, 'bower_components/jquery-ui.js'),
    path.join(conf.paths.dist, '/scripts/vendor/jquery.form.js'),
    path.join(conf.paths.dist, 'bower_components/angular.js'),
    path.join(conf.paths.dist, 'bower_components/angular-ui-router.js'),
    path.join(conf.paths.dist, 'bower_components/bootstrap.js'),
    path.join(conf.paths.dist, 'bower_components/bootstrap.min.js'),
    path.join(conf.paths.dist, '/scripts/vendor/jquery.min.js'),
    path.join(conf.paths.dist, '/scripts/vendor/bootstrap.min.js'),

    path.join(conf.paths.dist, 'scripts/app.js'),
    path.join(conf.paths.dist, 'scripts/logger.js'),
    path.join(conf.paths.dist, 'scripts/helpers.js'),

    path.join(conf.paths.dist, 'scripts/shared/common/directives.js'),
    path.join(conf.paths.dist, 'scripts/shared/common/common.js'),
    path.join(conf.paths.dist, 'scripts/shared/common/factory.js'),
    path.join(conf.paths.dist, 'scripts/shared/common/service.js'),
    path.join(conf.paths.dist, 'scripts/shared/common/errorhandler.js'),
    path.join(conf.paths.dist, 'scripts/templateCacheHtml.js'),
    path.join(conf.paths.dist, 'scripts/templateHelper.js'),

    path.join(conf.paths.dist, 'scripts/shared/vendor/bootstrap/bootstrap.js'),
    path.join(conf.paths.dist, 'scripts/shared/vendor/modernizr/modernizr.js'),

    path.join(conf.paths.dist, 'scripts/shared/js/ui-bootstrap-tpls.js')
  ], {
    read: false
  });
  return gulp.src(path.join(conf.paths.src, '/*.html'))
    .pipe($.inject(series(injectStyles), injectOptions))
    .pipe($.inject(series(injectScripts1), injectOptions))
    .pipe(wiredep(_.extend({}, conf.wiredep)))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
});