const gulp   = require('gulp')
const fs = require('fs');
const path = require('path');
const tasks = fs.readdirSync('./gulp/tasks/');

tasks.forEach((task) =>
  require(path.join(__dirname, 'tasks', task))
);

const browserSync = require('browser-sync');
const server = browserSync.create();
const paths = require('./paths');

const reload = (done) => {
  server.reload();
  done();
};

const serve = (done) => {
  const files = [
    paths.browserSync.html,
    paths.browserSync.js,
    paths.browserSync.css,
    paths.browserSync.img
  ];
  browserSync.init(files, {
    server: {
      baseDir: paths.dist.html
    }
  });
  done();
};

gulp.task('watch', () => {
  gulp.watch([paths.source.slides, paths.source.templates], gulp.series('pug'));
  gulp.watch(paths.source.js, gulp.series('js'));
  gulp.watch(paths.source.watch.style, gulp.series('style'));
  gulp.watch(paths.source.img, gulp.series('imagemin'));
});


module.exports = gulp.task('default', gulp.series('js', 'pug', 'notes', 'style', 'imagemin', serve, 'watch', reload));
