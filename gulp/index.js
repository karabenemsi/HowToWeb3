const gulp = require('gulp')
  , fs = require('fs')
  , path = require('path')
  , plumber = require('gulp-plumber')
  , pug      = require('gulp-pug')
  , paths = require('./paths')
  , uglify = require('gulp-uglify')
  , browserSync = require('browser-sync')
  , tasks = fs.readdirSync('./gulp/tasks/');
  const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const minifyCss = require('gulp-clean-css');
const rename = require('gulp-rename');
const server = browserSync.create();

gulp.task('js', () =>
  gulp.src(paths.source.js)
    .pipe(plumber())
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist.js))
);

gulp.task('notes', () =>
  gulp.src('src/js/vendor/notes/notes.html')
    .pipe(gulp.dest('dist/js/vendor/notes/'))
);

gulp.task('watch', () => {
  gulp.watch([paths.source.slides, paths.source.templates], gulp.series('pug', reload));
  gulp.watch(paths.source.js, gulp.series('js', reload));
  gulp.watch(paths.source.watch.style, gulp.series('style', reload));
});


gulp.task('pug', () =>
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



// Führt einen Reload der Browserfenster aus.
function reload(done) {
  server.reload();
  done();
}

// Erstellt einen Server auf dem Localhost um dort während der Entwicklung die Dateien zu hosten
function serve(done) {
  server.init({
    server: {
      baseDir: paths.dist.html
    }
  });
  done();
}


gulp.task("style", () =>
  gulp.src(paths.source.style)
    .pipe(plumber())
    .pipe(sass().on("error", sass.logError))

    // .pipe(
    //   concatCss("main.css", {
    //     rebaseUrls: false
    //   })
    // )
    .pipe(autoprefixer())
    .pipe(sourcemaps.init())
    .pipe(minifyCss())
    .pipe(
      rename({
        extname: ".min.css"
      })
    )
    .pipe(sourcemaps.write(""))
    .pipe(gulp.dest(paths.dist.css))
);

gulp.task('imagemin', () =>
  gulp.src(paths.source.img)
    .pipe(plumber())
    // .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest(paths.dist.img))
);



gulp.task('default', gulp.series('js', 'pug', 'notes', 'style', serve, 'watch', reload));



