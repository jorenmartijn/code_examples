"use strict";
var gulp = require('gulp');
var argv  = require('yargs').argv;
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var postcss = require('gulp-postcss');
var mqpacker = require('css-mqpacker');
var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync');
var connect = require("gulp-connect-php");
var notify = require("gulp-notify");
var del = require('del');
var pump = require('pump');
var gulpif       = require('gulp-if');
var cleanCSS = require('gulp-clean-css');
var paths = {
  dirs: {
    root : './',
     build: './custom/build',
     assets: './assets',
     images: './custom/build/img/',
     svg: './custom/build/svg/',
     css_build: './custom/build/css/',
     css_assets: './assets/css/',
     js_build: './custom/build/js/',
     js_assets: './assets/js/',
  },
  js: {
    functions: './assets/js/*.js',
    vendors: './assets/js/_vendor/**/*.js',

  },
  images: './assets/img/**/*.{png,jpg,gif}',
  svg: './assets/svg/**/*',
  scss: './assets/style.scss',
  // html: './custom/build/*.html',
  maps : './assets/maps',
};

// Change VHOST url here for browserSync
var vhost_url = 'www.parrot-theme.test'

// Gulp browserSync
var reload  = browserSync.reload;
gulp.task('php', function() {
  connect.server( { base: vhost_url, port: 3000, keepalive: true});
});
gulp.task('browser-sync',['php'], function() {
    browserSync({
        open: 'external',
        host: vhost_url,
        proxy: vhost_url, // or project.dev/app/
        port: 3000,
        snippetOptions: {
          ignorePaths: ["core/**",'wp-admin/**']
        }
    });
});


// Gulp sass
gulp.task('sass', function(cb) {
    pump([
    gulp.src(paths.scss),
    gulpif(argv.production, sass({outputStyle: 'compressed'}).on('error', notify.onError({
          message: "<%= error.message %>",
          title: "Sass Error"
      }))),
    gulpif(!argv.production, sass({outputStyle: 'expanded'}).on('error', notify.onError({
          message: "<%= error.message %>",
          title: "Sass Error"
      }))),
    // sass.sync({outputStyle: 'compressed'}).on('error', sass.logError)
    gulpif(argv.production, rename({extname: '.min.css'})),
    postcss([ autoprefixer('last 4 versions', 'ie >= 10', 'Safari >= 9'),mqpacker({sort: true}) ]),
    gulpif(argv.production, cleanCSS()),
    gulp.dest(paths.dirs.css_build),  // style.min.css to build
    gulpif(!argv.production, browserSync.stream({match: '**/style.css'})), gulpif(argv.production, browserSync.stream({match: '**/style.min.css'}))
    ],
    cb
  );
});


// main.min.js
gulp.task('main', function(cb) {
  pump([
      gulp.src([paths.js.vendors,'!./assets/js/_vendor/foundation/disable/*', paths.js.functions]), // to assets
      concat('main.js'),
      // gulp.dest(paths.dirs.js_assets), // main.js to build
      gulpif(argv.production, rename({extname: '.min.js'})),
      gulpif(argv.production , uglify({
        mangle: true,
        compress: {
          drop_console: true
        }
      }).on('error', notify.onError({
            message: "<%= error.message %>",
            title: "Sass Error"
      }))),
      gulp.dest(paths.dirs.js_build), // main.min.js to build
      browserSync.stream({match: '**/main.min.js'})
    ],
    cb
  );
});

// images compress
gulp.task('images', function() {
  return gulp.src(paths.images)
  .pipe(imagemin({optimizationLevel: 5}))
  .pipe(gulp.dest(paths.dirs.images));
});

// svg compress
gulp.task('svg', function() {
  return gulp.src(paths.svg)
  .pipe(imagemin({optimizationLevel: 5}))
  .pipe(gulp.dest(paths.dirs.svg));
});

// Console log error
var reportError = function (error) {
    notify({
        title: 'Gulp Task Error',
        message: 'Check the console.'
    }).write(error);
    console.log(error.toString());
    this.emit('end');
}


// Gulp watch
gulp.task('serve',['browser-sync'], function() {
  gulp.watch(["assets/scss/**/*.scss","assets/style.scss"], ['sass']);
  gulp.watch('assets/js/**/*.js', ['main']);
  gulp.watch('assets/img/**/*', ['images']);
  gulp.watch('assets/svg/**/*.svg', ['svg']);
  gulp.watch(['custom/themes/**/*.php','!custom/themes/**/functions/*.php']).on('change', function () {
     browserSync.reload();
   });
  // gulp.watch("build/*.html").on('change', browserSync.reload);
});
