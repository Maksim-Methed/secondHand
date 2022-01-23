import gulp from 'gulp';
import browserSync from 'browser-sync';
import cssImport from 'gulp-cssimport';
import del from 'del';
import gulpImg from 'gulp-image';
import cleanCss from 'gulp-clean-css';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';


const html = () => gulp
  .src('src/*.html')
  .pipe(gulp.dest('dist'))
  .pipe(browserSync.stream());

const css = () => gulp
  .src('src/css/index.css')
  .pipe(cssImport())
  .pipe(cleanCss())
  .pipe(gulp.dest('dist/css'))
  .pipe(browserSync.stream());

const js = () => gulp
  .src('src/scripts/**/*.js')
  .pipe(webpackStream({
    mode: 'production',
    devtool: false,
    optimization: {
      minimize: true
    },
    output: {
      filename: 'index.js'
    }
  }, webpack))
  .pipe(gulp.dest('dist/scripts'))
  .pipe(browserSync.stream());

const copy = () => gulp
  .src([
    'src/api/**/*',
    'src/fonts/**/*'
  ], {
    base: 'src'
  })
  .pipe(gulp.dest('dist'));


const img = () => gulp
  .src('src/img/**/*.{jpg,jpeg,svg,gif,png}')
  .pipe(gulpImg())
  .pipe(gulp.dest('dist/img'))


const server = () => {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  });

  gulp.watch('src/*.html', html)
  gulp.watch('src/css/**/*.css', css)
  gulp.watch('src/scripts/**/*.js', js)
};

const clear = () => del('dist/**/*')

export default gulp.series(clear, gulp.parallel(html, css, js, copy, img), server);
