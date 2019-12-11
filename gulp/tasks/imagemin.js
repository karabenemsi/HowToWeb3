// Necessary Plugins
const gulp      = require('gulp');
const plumber   = require('gulp-plumber');
const paths     = require('../paths');
// const imin  = require('gulp-imagemin');;

// Call Imagemin
module.imagemin = gulp.task('imagemin', () =>
  gulp.src(paths.source.img)
    .pipe(plumber())
    // .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest(paths.dist.img))
);
