const gulp = require('gulp');
const { src, dest, series, parallel } = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const imagemin = require('gulp-imagemin');
const merge = require('gulp-merge');
const del = require('del');

const html = () => {
    return src('src/pug/*.pug')
        .pipe(pug({ pretty: true }))
        .pipe(dest('build/html'))
}

const styles = () => {
    return src('src/styles/*.scss')
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(dest('build/styles'))
}

const images = (cb) => {
    const desktop = src('src/images/desktop/*.*')
        .pipe(imagemin())
        .pipe(dest('build/images/desktop'));
    const mobile = src('src/images/mobile/*.*')
        .pipe(imagemin())
        .pipe(dest('build/images/mobile'));
    const tablet = src('src/images/tablet/*.*')
        .pipe(imagemin())
        .pipe(dest('build/images/tablet'));
    return merge(desktop, mobile, tablet, cb())
}

const delBuild = (cb) => {
    return del('build/**/*.*').then(() => { cb() })
}

exports.default = series(
    delBuild,
    parallel(html, styles, images)
)