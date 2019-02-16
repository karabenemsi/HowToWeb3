// Necessary Plugins
const gulp = require("gulp"),
  plumber = require("gulp-plumber"),
  paths = require("../paths");
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const minifyCss = require('gulp-clean-css');
const rename = require('gulp-rename');
// const concatCss = require('gulp-concat-css');

// Call Stylus
module.exports = gulp.task("style", () =>
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
