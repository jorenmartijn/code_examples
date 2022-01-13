var gulp = require('gulp');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var postcss = require('gulp-postcss');
var mqpacker = require('css-mqpacker');
var autoprefixer = require('autoprefixer');
var del = require('del');
var pump = require('pump');
var cleanCSS = require('gulp-clean-css');
var paths = {
  scss: './scss/custom-default.scss',
  js: ['./js/vendor/readmore/readmore.min.js', './js/custom.js'],
  html: './build/*.html',
};

gulp.task('sass', function(cb) {
    pump([
    gulp.src(paths.scss),
    sass({outputStyle: 'compressed'}).on('error', sass.logError),
    postcss([ autoprefixer(),mqpacker({sort: true}) ]),
    cleanCSS(),
    rename("custom.min.css"),
    gulp.dest('./css/'),
    ],
    cb
  );
});


gulp.task('js', function(cb) {
  pump([
      gulp.src(paths.js), // to assets
      concat('custom.js'),
      rename({extname: '.min.js'}),
      uglify({
        mangle: true,
        compress: {
        drop_console: true
        }
      }),
      gulp.dest('./js/'), // main.min.js to build
    ],
    cb
  );
});


function onError(err) {
    console.log(err);
    this.emit('end');
}

gulp.task('serve', function() {
  gulp.watch("./scss/custom-default.scss", ['sass']);
  gulp.watch("./js/custom.js", ['js']);
});
