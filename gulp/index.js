const gulp = require("gulp");
const fs = require("fs");
const path = require("path");
const del = require("del");
const tasks = fs.readdirSync("./gulp/tasks/");

tasks.forEach((task) => require(path.join(__dirname, "tasks", task)));

const browserSync = require("browser-sync");
const server = browserSync.create();
const paths = require("./paths");

const reload = (done) => {
  server.reload();
  done();
};

const serve = (done) => {
  const files = [
    paths.browserSync.html,
    paths.browserSync.js,
    paths.browserSync.css,
    paths.browserSync.img,
  ];
  browserSync.init(files, {
    server: {
      baseDir: paths.dist.html,
    },
  });
  done();
};

gulp.task("watch", () => {
  gulp.watch([paths.source.slides, paths.source.templates], gulp.series("pug"));
  gulp.watch(paths.source.js, gulp.series("js"));
  gulp.watch(paths.source.watch.style, gulp.series("style"));
  gulp.watch(paths.source.img, gulp.series("imagemin"));
});

const clean = (done) => {
  return del([paths.dist.html]);
};

module.exports = gulp.task(
  "default",
  gulp.series(
    clean,
    "js",
    "pug",
    "notes",
    "style",
    "imagemin",
    serve,
    "watch",
    reload
  )
);

exports.build = gulp.task(
  "build",
  gulp.series(clean, "js", "pug", "notes", "style", "imagemin")
);

exports.deploy = gulp.task(
  "deploy",
  gulp.series("build", () => {
    return gulp
      .src([paths.dist.root+'**/*'], {
        base: paths.dist.root,
      })
      .pipe(gulp.dest(paths.deploy.pages));
  })
);
