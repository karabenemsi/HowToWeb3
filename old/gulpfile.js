const { task, dest, watch, src, series, parallel } = require('gulp');
const del = require('del');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const concatCss = require('gulp-concat-css');
const minifyCss = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const pug = require('gulp-pug');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const merge = require('merge-stream');
const browserSync = require('browser-sync');
const headerComment = require('gulp-header-comment');
const gulpif = require('gulp-if');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
const tsify = require('tsify');
const browserify = require('browserify');
const babelify = require('babelify');

const server = browserSync.create();

const options = require('./gulp/options');

function reload(done) {
  server.reload();
  done();
}

function serve(done) {
  server.init({
    server: {
      baseDir: options.devServerRoot,
    },
  });
  done();
}

function clean() {
  return del([options.devServerRoot]);
}

function scss() {
  let bundles = [];
  options.sassBundles.forEach(function(bundle, index) {
    bundles[index] = src(bundle.sassFiles)
      .pipe(sass().on('error', sass.logError))

      .pipe(
        concatCss(bundle.outputFile, {
          rebaseUrls: false,
        })
      )
      .pipe(autoprefixer())
      .pipe(headerComment(options.headerText))
      .pipe(dest(bundle.outputFolder))
      .pipe(sourcemaps.init())
      .pipe(minifyCss())
      .pipe(
        rename({
          extname: '.min.css',
        })
      )
      .pipe(headerComment(options.headerText))
      .pipe(sourcemaps.write(''))
      .pipe(dest(bundle.outputFolder));
  });
  return merge(bundles);
}

function vendorJs() {
    return src(options.jsVendorBundle.jsFiles)
      .pipe(concat(options.jsVendorBundle.outputFile))
      .pipe(dest(options.jsVendorBundle.outputFolder))
      // .pipe(uglify())
      .pipe(
        rename({
          extname: '.min.js',
        })
      )
      .pipe(dest(options.jsVendorBundle.outputFolder));
}

function js() {
  return browserify({
    entries: ['./src/js/main.ts'],
    debug: true,
    cache: {},
    packageCache: {},
    // transform: [
    //   babelify.configure({
    //     presets: ['@babel/preset-env'],
    //   }),
    // ],
  })
    .plugin(tsify)
    .bundle()
    .on('error', function(error) {
      console.error(error.message);
      this.emit('end');
    })
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(headerComment(options.headerText))
    .pipe(dest(options.devServerRoot + '/js'))
    .pipe(
      rename({
        extname: '.min.js',
      })
    )
    .pipe(
      sourcemaps.init({
        loadMaps: true,
      })
    )
    .pipe(uglify())
    .pipe(headerComment(options.headerText))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(options.devServerRoot + '/js'))
    .pipe(server.stream());
}

function pugBuild() {
  let bundles = [];
  options.pugBundles.forEach(function(bundle, index) {
    bundles[index] = src(bundle.pugFiles)
      .pipe(
        pug({
          pretty: true,
        }).on('error', function(err) {
          console.error(err.message);
          this.emit('end');
        })
      )
      .pipe(dest(bundle.outputFolder));
  });

  return merge(bundles);
}

const images = function copyImages() {
  return src('src/images/**/*').pipe(dest(options.devServerRoot + '/images/'));
};

function fonts() {
  return src(options.fontsBundle.fontFiles).pipe(
    dest(options.devServerRoot + '/fonts/')
  );
}

const watcher = parallel(
  function watcherPug() {
    return watch(options.watchPugFiles, series(pugBuild, reload));
  },
  function watcherScss() {
    return watch(options.watchSassFiles, series(scss, reload));
  },
  function watcherJS() {
    return watch(options.watchTSFiles, series(js, reload));
  }
);

const build = series(clean, parallel(scss,vendorJs, js, pugBuild, images, fonts));

// const dev = series(build, serve, reload);
const dev = series(build, serve, watcher, reload);

task(
  'publish',
  series(build, function publishToServer() {
    return src(options.devServerRoot + '/**/*').pipe(dest(options.externalSeverRoot));
  })
);

function errorHandler(error) {
  console.log(error.message);
}

exports.default = dev;
