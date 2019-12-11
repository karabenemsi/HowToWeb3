module.exports = {
  source: {
    templates: 'src/templates/**/*.pug',
    slides: 'src/slides/**/*.pug',
    js: 'src/js/**/*.js',
    style: 'src/style/*.scss',
    img: 'src/img/**/*',
    files: {
      pug: 'src/templates/index.pug',
      style: 'src/style/main.scss',
      notes: 'src/js/vendor/notes/notes.html'
    },
    watch: {
      style: 'src/style/**/*.scss',
    }

  },

  browserSync: {
    html: 'dist/**/*.html',
    js: 'dist/js/**/*.js',
    css: 'dist/css/**/*.css',
    img: 'dist/img/**/*'
  },

  dist: {
    html: './dist/',
    js: 'dist/js',
    css: 'dist/css',
    img: 'dist/img',
    notes: 'dist/js/vendor/notes/'
  },

  deploy: {
    pages: 'dist/**/*'
  }
};
