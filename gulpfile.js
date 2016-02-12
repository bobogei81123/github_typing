'use strict';

const gulp = require('gulp'),
      $ = require('gulp-load-plugins')(),
      browserSync = require('browser-sync').create(),
      browserify = require('browserify'),
      babelify = require('babelify'),
      source = require('vinyl-source-stream'),
      del = require('del');

const semantic = require('./semantic/tasks/build');

const config = {
    watch: {
        jade: 'src/jade/**/*.jade',
        js: 'src/js/**/*.js',
        css: 'src/css/**/*.css',
    },
    out: {
        base: 'static/',
        html: 'static/',
        js: 'static/js/',
        css: 'static/css',
    }
};

const logError = (err) => {
    $.util.log($.util.colors.red('[Error]'), err.toString());
}

gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: config.out.base,
        },
        open: false
    });
});

gulp.task('jade', () => {
    gulp.src('src/jade/index.jade')
        .pipe($.jade())
        .on('error', logError)
        .pipe(gulp.dest(config.out.html))
        .pipe(browserSync.stream())
});

gulp.task('css', () => {
    gulp.src('src/css/**/*.css')
        .pipe($.postcss([
            require('postcss-short'),
            require('precss'),
        ]))
        .on('error', logError)
        .pipe(gulp.dest(config.out.css))
        .pipe(browserSync.stream())
});

gulp.task('js', () => {
    browserify({entries: ['./src/js/main.js']})
        .transform(babelify, {
            presets: ['stage-0'],
            plugins: ["transform-es2015-modules-commonjs"],
        })
        .bundle()
        .on('error', logError)
        .pipe(source('main.js'))
        .pipe(gulp.dest(config.out.js))
        .pipe(browserSync.stream({once: true}))
});

gulp.task('watch', () => {
    gulp.watch(config.watch.jade, ['jade']);
    gulp.watch(config.watch.js, ['js']);
    gulp.watch(config.watch.css, ['css']);
});

gulp.task('clean', () => {
    del(['static/**/*'])
})

gulp.task('semantic', semantic);

gulp.task('init', ['semantic']);

gulp.task('build', ['jade', 'css', 'js']);

gulp.task('default', ['build', 'watch', 'browser-sync']);

