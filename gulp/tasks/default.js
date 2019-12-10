const gulp = require('gulp');

// Default task
module.exports = gulp.task('default', ['js', 'pug', 'notes', 'style', 'imagemin', 'watch', 'browser-sync', 'js']);
