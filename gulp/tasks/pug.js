// Necessary Plugins
const gulp     = require('gulp')
    , plumber  = require('gulp-plumber')
    , paths    = require('../paths')
    , fs       = require('fs')
    , pug      = require('gulp-pug');

// Call Pug to compile Templates
module.exports = gulp.task('pug', () =>
  gulp.src(paths.source.files.pug)
    .pipe(plumber())
    .pipe(pug({
      pretty: true,
    }).on('error', function (err) {
      console.error(err.message);
      this.emit('end');
    }))
    .pipe(gulp.dest(paths.dist.html))
);
