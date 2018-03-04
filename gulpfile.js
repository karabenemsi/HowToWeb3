var gulp = require("gulp"),
  fs = require("fs"),
  sass = require("gulp-sass"),
  concat = require('gulp-concat'),
  concatCss = require('gulp-concat-css'),
  minifyCss = require('gulp-clean-css'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  cssBase64 = require('gulp-css-base64'),
  connect = require('gulp-connect'),
  pug = require('gulp-pug'),
  autoprefixer = require('gulp-autoprefixer');

var npmPath = 'node_modules/';

var sassBundles = [{
  sassFiles: [
    npmPath + 'normalize.css/normalize.css',
    'scss/global.scss',
  ],
  outputFile: 'main.css',
  outputFolder: '_public/css'
}];
var watchSassFiles = ['scss/**/*.scss'].concat(sassBundles.map(bundle => bundle.sassFiles));

var jsBundles = [{
    jsFiles: [
      npmPath + 'jquery/dist/jquery.js',
      // npmPath + 'gsap/TweenLite.js',
      // npmPath + 'gsap/CSSPlugin.js',
      // npmPath + 'gsap/EasePack.js',
      // npmPath + 'scrollmagic/scrollmagic/uncompressed/ScrollMagic.js',
      // npmPath + 'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js',
      // npmPath + 'flowplayer/dist/flowplayer.js',
      // npmPath + 'bxslider/dist/jquery.bxslider.js'
    ],
    outputFile: 'vendor.js',
    outputFolder: '_public/js'
  },
  {
    jsFiles: [
      'js/**/*.js',
    ],
    outputFile: 'site.js',
    outputFolder: '_public/js'
  }
];
var watchJSFiles = ['js/**/*.js'].concat(jsBundles.map(bundle => bundle.jsFiles));

var pugBundles = [{
  pugFiles: [
    'pug/*.pug',
    'pug/sites/**/*.pug',
  ],
  outputFile: 'index.html',
  outputFolder: '_public/'
}];
var watchPugFiles = ['pug/**/*.pug'].concat(pugBundles.map(bundle => bundle.pugFiles));

var fontBundles = [{
  fontFiles: [
    'fonts/*',
    npmPath + 'mdi/fonts/*',
    // npmPath + 'flowplayer/dist/skin/icons/*',
  ]
}];

gulp.task('connect', function () {
  connect.server({
    root: '_public',
    livereload: true,
  });
});

gulp.task('livereload', function () {
  gulp.src('./_public/**/*')
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(watchSassFiles, ['sass'])
    .on('change', function (event) {
      console.log('[SASS-Watcher] Datei ' + event.path + ' hat sich geändert. Typ der Änderung: ' + event.type);
    });
  gulp.watch(watchJSFiles, ['js'])
    .on('change', function (event) {
      console.log('[JS-Watcher] Datei ' + event.path + ' hat sich geändert. Typ der Änderung: ' + event.type);
    });
  gulp.watch(watchPugFiles, ['pug'])
    .on('change', function (event) {
      console.log('[pug-Watcher] Datei ' + event.path + ' hat sich geändert. Typ der Änderung: ' + event.type);
    });
  gulp.watch('./_public/**/*', ['livereload']);
});

gulp.task("sass", function () {
  sassBundles.forEach(function (bundle) {
    console.log('Compiliere und Optimiere SASS-Dateien für Bundle ' + bundle.outputFile);
    checkAndLogIfBundleFilesDoesntExist(bundle.sassFiles);

    return gulp.src(bundle.sassFiles)
      .pipe(sass().on('error', sass.logError))
      .pipe(concatCss(bundle.outputFile))
      // Base64 is super slow. Use only if necessary 
      // .pipe(cssBase64()) 
      .pipe(autoprefixer())
      .pipe(gulp.dest(bundle.outputFolder))
      .pipe(minifyCss()) 
      .pipe(rename({ extname: '.min.css' })) 
      .pipe(gulp.dest(bundle.outputFolder)); 
  });
});

gulp.task("js", function () {
  jsBundles.forEach(function (bundle) {
    // console.log('Optimiere JS-Dateien für Bundle ' + bundle.outputFile); 
    checkAndLogIfBundleFilesDoesntExist(bundle.jsFiles);

    return gulp.src(bundle.jsFiles)
      .pipe(concat(bundle.outputFile))
      .pipe(gulp.dest(bundle.outputFolder))
      .pipe(uglify())
      .pipe(rename({
        extname: '.min.js'
      }))
      .pipe(gulp.dest(bundle.outputFolder));
  });
});

gulp.task("pug", function () {
  pugBundles.forEach(function (bundle) {
    // console.log('Optimiere pug-Dateien für Bundle ' + bundle.outputFile); 
    checkAndLogIfBundleFilesDoesntExist(bundle.pugFiles);

    return gulp.src(bundle.pugFiles)
      .pipe(pug({
        pretty: true
      }).on('error', console.log))
      .pipe(gulp.dest(bundle.outputFolder));
  });
});

gulp.task('images', function () {
  return gulp.src('images/**/*')
    .pipe(gulp.dest('_public/images/'));
});

gulp.task('fonts', function () {
  fontBundles.forEach(function (bundle) {
    return gulp.src(bundle.fontFiles)
      .pipe(gulp.dest('_public/fonts/'));
  });
});

gulp.task('default', ['connect', 'watch', 'sass', 'js', 'pug']);

gulp.task('build', ['sass', 'js', 'pug', 'images', 'fonts']);

/** 
 * Prüft, ob alle Eingangsdateien eines Bundles existieren. Falls nicht, wird eine Fehlermeldung mit den betroffenen Dateien ausgegeben. Wildcard-Filter wie * oder ** werden ignoriert. 
 * @param {any} filePaths Auflistung von Pfaden für die Quelldateien 
 */
function checkAndLogIfBundleFilesDoesntExist(filePaths) {
  filePaths.forEach(file => {
    if (file.indexOf('*') === -1) {
      fs.stat(file, function (err, stat) {
        if (err !== null) {
          console.error(file + ': Datei existiert nicht! Fehlercode ' + err.code);
        }
      });
    } else {
      // console.log(file + ': Pfad enthält Wildcard-Filter, die ungeprüft übernommen werden.'); 
    }
  });
}
